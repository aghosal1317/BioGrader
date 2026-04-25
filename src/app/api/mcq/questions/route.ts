import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/mcq/questions?unit=1  — fetch MCQs for a given unit (mobile app + web)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const unit = parseInt(req.nextUrl.searchParams.get("unit") ?? "")
  if (isNaN(unit) || unit < 1 || unit > 8) {
    return NextResponse.json({ error: "unit must be 1–8" }, { status: 400 })
  }

  const questions = await prisma.mCQ.findMany({
    where: { unit },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      question: true,
      options: true,
      answer: true,
      explanation: true,
      unit: true,
      topicSlug: true,
      difficulty: true,
      year: true,
    },
  })

  return NextResponse.json({ questions, unit })
}
