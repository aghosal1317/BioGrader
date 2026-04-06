import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()

    // Bulk import: array of MCQs
    if (Array.isArray(body)) {
      const results = { created: 0, errors: [] as string[] }
      for (const item of body) {
        try {
          await prisma.mCQ.create({ data: normalizeMcq(item) })
          results.created++
        } catch (e: unknown) {
          results.errors.push(`Row error: ${e instanceof Error ? e.message : String(e)}`)
        }
      }
      return NextResponse.json(results)
    }

    // Single MCQ
    const mcq = await prisma.mCQ.create({ data: normalizeMcq(body) })
    return NextResponse.json({ success: true, mcq })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create MCQ" }, { status: 500 })
  }
}

function normalizeMcq(item: Record<string, unknown>) {
  const { question, optionA, optionB, optionC, optionD, answer, explanation, unit, topicSlug, difficulty, year } = item as Record<string, string>

  if (!question || !optionA || !optionB || !optionC || !optionD || !answer || !explanation || !unit) {
    throw new Error("Missing required MCQ fields")
  }

  const validAnswers = ["A", "B", "C", "D"]
  const normalizedAnswer = String(answer).toUpperCase().trim()
  if (!validAnswers.includes(normalizedAnswer)) {
    throw new Error(`Invalid answer "${answer}" — must be A, B, C, or D`)
  }

  return {
    question: String(question).trim(),
    options: {
      A: String(optionA).trim(),
      B: String(optionB).trim(),
      C: String(optionC).trim(),
      D: String(optionD).trim(),
    },
    answer: normalizedAnswer,
    explanation: String(explanation).trim(),
    unit: Number(unit),
    topicSlug: topicSlug ?? unitToSlug(Number(unit)),
    difficulty: (["EASY", "MEDIUM", "HARD"].includes(String(difficulty ?? "").toUpperCase())
      ? String(difficulty).toUpperCase()
      : "MEDIUM") as "EASY" | "MEDIUM" | "HARD",
    year: year ? Number(year) : null,
  }
}

function unitToSlug(unit: number): string {
  const map: Record<number, string> = {
    1: "chemistry-of-life",
    2: "cell-structure",
    3: "cellular-energetics",
    4: "cell-communication",
    5: "heredity",
    6: "gene-expression",
    7: "natural-selection",
    8: "ecology",
  }
  return map[unit] ?? "chemistry-of-life"
}
