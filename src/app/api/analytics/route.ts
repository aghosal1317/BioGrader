import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subDays, format } from "date-fns"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [stats, recentSubmissions, allTopics, mcqByUnit] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId: session.user.id } }),
    prisma.submission.findMany({
      where: {
        userId: session.user.id,
        status: "GRADED",
        submittedAt: { gte: subDays(new Date(), 90) },
      },
      include: { frq: { include: { topic: true } } },
      orderBy: { submittedAt: "asc" },
    }),
    prisma.topic.findMany({ orderBy: { apUnit: "asc" } }),
    prisma.mCQAttempt.findMany({
      where: { userId: session.user.id },
      select: { unit: true, correct: true },
    }),
  ])

  // Build score-over-time series (weekly buckets)
  const weeklyMap = new Map<string, { total: number; count: number }>()
  for (const sub of recentSubmissions) {
    const week = format(sub.submittedAt, "MMM d")
    const existing = weeklyMap.get(week) ?? { total: 0, count: 0 }
    const pct =
      sub.totalScore != null && sub.maxScore
        ? Math.round((sub.totalScore / sub.maxScore) * 100)
        : 0
    weeklyMap.set(week, { total: existing.total + pct, count: existing.count + 1 })
  }

  const scoreOverTime = Array.from(weeklyMap.entries()).map(([week, { total, count }]) => ({
    week,
    avgScore: Math.round(total / count),
  }))

  // Aggregate MCQ attempts by unit
  const mcqStats: Record<number, { attempts: number; correct: number }> = {}
  for (const attempt of mcqByUnit) {
    if (!mcqStats[attempt.unit]) mcqStats[attempt.unit] = { attempts: 0, correct: 0 }
    mcqStats[attempt.unit].attempts++
    if (attempt.correct) mcqStats[attempt.unit].correct++
  }

  return NextResponse.json({
    stats,
    scoreOverTime,
    mcqStats,
    recentSubmissions: recentSubmissions.slice(-10).map((s) => ({
      id: s.id,
      frqYear: s.frq.year,
      frqTopic: s.frq.topic.name,
      totalScore: s.totalScore,
      maxScore: s.maxScore,
      submittedAt: s.submittedAt,
      timeSpentSec: s.timeSpentSec,
    })),
    topics: allTopics,
  })
}
