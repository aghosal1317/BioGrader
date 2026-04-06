import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { anthropic, GRADING_MODEL } from "@/lib/anthropic"
import { buildGradingPrompt } from "@/lib/grading/prompt"
import { gradingToolSchema, parseGradingResponse } from "@/lib/grading/parser"
import { updateUserStats } from "@/lib/stats/updateUserStats"
import { RubricCategory } from "@/types/rubric"
import { z } from "zod"

export const maxDuration = 60

const schema = z.object({ submissionId: z.string() })

// Configurable daily limit — set DAILY_GRADE_LIMIT in env to override (0 = unlimited)
const DAILY_LIMIT = parseInt(process.env.DAILY_GRADE_LIMIT ?? "10")

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { submissionId } = parsed.data

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { frq: { include: { topic: true } } },
  })

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  }
  if (submission.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (submission.status === "GRADED") {
    return NextResponse.json(submission)
  }

  // ── Rate limit: max DAILY_LIMIT new gradings per user per day ──────────────
  if (DAILY_LIMIT > 0) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const gradedToday = await prisma.submission.count({
      where: {
        userId: session.user.id,
        status: "GRADED",
        gradedAt: { gte: startOfDay },
      },
    })

    if (gradedToday >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached. You can grade up to ${DAILY_LIMIT} FRQs per day. Resets at midnight.` },
        { status: 429 }
      )
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Mark as grading
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "GRADING" },
  })

  try {
    const rubric = submission.frq.rubric as unknown as RubricCategory[]
    const prompt = buildGradingPrompt(
      submission.frq.prompt,
      rubric,
      submission.answerText,
      submission.frq.totalPoints
    )

    const response = await anthropic.messages.create({
      model: GRADING_MODEL,
      max_tokens: 4096,
      tools: [gradingToolSchema],
      tool_choice: { type: "any" },
      messages: [{ role: "user", content: prompt }],
    })

    const gradingResult = parseGradingResponse(response, rubric, submission.frq.totalPoints)

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "GRADED",
        totalScore: gradingResult.totalScore,
        maxScore: gradingResult.maxScore,
        gradingResult: gradingResult as unknown as object,
        gradedAt: new Date(),
      },
    })

    await updateUserStats(
      session.user.id,
      submission.frq.topic.slug,
      gradingResult,
      submission.timeSpentSec
    )

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Grading error:", err)
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "FAILED" },
    })
    return NextResponse.json({ error: "Grading failed. Please try again." }, { status: 500 })
  }
}
