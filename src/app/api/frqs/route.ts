import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Difficulty } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get("year")
  const topicId = searchParams.get("topicId")
  const difficulty = searchParams.get("difficulty") as Difficulty | null
  const page = parseInt(searchParams.get("page") ?? "1")
  const limit = parseInt(searchParams.get("limit") ?? "20")

  const where = {
    ...(year ? { year: parseInt(year) } : {}),
    ...(topicId ? { topicId } : {}),
    ...(difficulty ? { difficulty } : {}),
  }

  const [frqs, total] = await Promise.all([
    prisma.fRQ.findMany({
      where,
      include: { topic: true },
      orderBy: [{ year: "desc" }, { questionNum: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.fRQ.count({ where }),
  ])

  // Attach last submission for this user
  const frqIds = frqs.map((f) => f.id)
  const lastSubmissions = await prisma.submission.findMany({
    where: { userId: session.user.id, frqId: { in: frqIds } },
    orderBy: { submittedAt: "desc" },
    distinct: ["frqId"],
    select: { frqId: true, totalScore: true, maxScore: true, submittedAt: true },
  })

  const submissionMap = new Map(lastSubmissions.map((s) => [s.frqId, s]))

  return NextResponse.json({
    frqs: frqs.map((frq) => ({
      ...frq,
      lastSubmission: submissionMap.get(frq.id) ?? null,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
