import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { tiptapToPlainText } from "@/lib/utils"
import { z } from "zod"

const schema = z.object({
  frqId: z.string(),
  content: z.record(z.string(), z.unknown()),
  timeSpentSec: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const frqId = searchParams.get("frqId")
  if (!frqId) return NextResponse.json({ error: "frqId required" }, { status: 400 })

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id, frqId, status: "GRADED" },
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      totalScore: true,
      maxScore: true,
      gradingResult: true,
      answerText: true,
      submittedAt: true,
      timeSpentSec: true,
    },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { frqId, content, timeSpentSec, imageUrl } = parsed.data
  const answerText = tiptapToPlainText(content as Record<string, unknown>)

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      frqId,
      answerContent: content as object,
      answerText,
      timeSpentSec,
      imageUrl,
      status: "PENDING",
    },
  })

  return NextResponse.json(submission)
}
