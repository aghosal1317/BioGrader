import { prisma } from "@/lib/prisma"
import { GradingResult } from "@/types/grading"
import { differenceInCalendarDays } from "date-fns"

export async function updateUserStats(
  userId: string,
  frqTopicSlug: string,
  gradingResult: GradingResult,
  timeSpentSec: number
) {
  const stats = await prisma.userStats.findUnique({ where: { userId } })
  const now = new Date()

  let currentStreak = stats?.currentStreak ?? 0
  let longestStreak = stats?.longestStreak ?? 0
  const lastActivity = stats?.lastActivityAt

  // Streak calculation
  if (lastActivity) {
    const daysDiff = differenceInCalendarDays(now, lastActivity)
    if (daysDiff === 0) {
      // Already active today — no change to streak
    } else if (daysDiff === 1) {
      currentStreak += 1
    } else {
      currentStreak = 1
    }
  } else {
    currentStreak = 1
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak

  // Update topic stats
  const topicStats = (stats?.topicStats as Record<
    string,
    { attempts: number; avgScore: number }
  >) ?? {}

  const existing = topicStats[frqTopicSlug] ?? { attempts: 0, avgScore: 0 }
  const newAttempts = existing.attempts + 1
  const newAvg =
    (existing.avgScore * existing.attempts + gradingResult.percentage) / newAttempts

  topicStats[frqTopicSlug] = {
    attempts: newAttempts,
    avgScore: Math.round(newAvg),
  }

  await prisma.userStats.upsert({
    where: { userId },
    update: {
      totalSubmissions: { increment: 1 },
      totalTimeSpentSec: { increment: timeSpentSec },
      currentStreak,
      longestStreak,
      lastActivityAt: now,
      topicStats,
    },
    create: {
      userId,
      totalSubmissions: 1,
      totalTimeSpentSec: timeSpentSec,
      currentStreak,
      longestStreak,
      lastActivityAt: now,
      topicStats,
    },
  })
}
