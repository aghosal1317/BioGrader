import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDuration } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCharts } from "./DashboardCharts"
import { BookOpen, Brain, Clock, Flame, Star, TrendingUp } from "lucide-react"
import { subDays, format } from "date-fns"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const [stats, recentSubmissions, mcqCounts, mcqAttemptStats] = await Promise.all([
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
    prisma.mCQ.groupBy({ by: ["unit"], _count: { id: true } }),
    prisma.mCQAttempt.groupBy({
      by: ["correct"],
      where: { userId: session.user.id },
      _count: { id: true },
    }),
  ])

  const avgScore = recentSubmissions.length > 0
    ? Math.round(
        recentSubmissions.reduce((sum, s) =>
          sum + (s.totalScore && s.maxScore ? (s.totalScore / s.maxScore) * 100 : 0), 0
        ) / recentSubmissions.length
      )
    : null

  // Weekly score series for chart
  const weeklyMap = new Map<string, { total: number; count: number }>()
  for (const sub of recentSubmissions) {
    const week = format(sub.submittedAt, "MMM d")
    const pct = sub.totalScore && sub.maxScore
      ? Math.round((sub.totalScore / sub.maxScore) * 100)
      : 0
    const ex = weeklyMap.get(week) ?? { total: 0, count: 0 }
    weeklyMap.set(week, { total: ex.total + pct, count: ex.count + 1 })
  }
  const scoreOverTime = Array.from(weeklyMap.entries()).map(([week, { total, count }]) => ({
    week,
    avgScore: Math.round(total / count),
  }))

  const topicStats = stats?.topicStats as Record<
    string,
    { attempts: number; avgScore: number }
  > | undefined
  const topicChartData = topicStats
    ? Object.entries(topicStats).map(([slug, data]) => ({
        topic: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        avgScore: data.avgScore,
        attempts: data.attempts,
      }))
    : []

  const mcqCountMap = new Map(mcqCounts.map((c) => [c.unit, c._count.id]))
  const totalMcqs = mcqCounts.reduce((sum, c) => sum + c._count.id, 0)

  const mcqCorrect = mcqAttemptStats.find((s) => s.correct)?._count.id ?? 0
  const mcqIncorrect = mcqAttemptStats.find((s) => !s.correct)?._count.id ?? 0
  const totalMcqAnswered = mcqCorrect + mcqIncorrect

  const MCQ_UNITS = [
    { unit: 1, name: "Chemistry of Life",              color: "bg-blue-500",    light: "bg-blue-50 text-blue-700" },
    { unit: 2, name: "Cell Structure",                 color: "bg-purple-500",  light: "bg-purple-50 text-purple-700" },
    { unit: 3, name: "Cellular Energetics",            color: "bg-yellow-500",  light: "bg-yellow-50 text-yellow-700" },
    { unit: 4, name: "Cell Communication",             color: "bg-pink-500",    light: "bg-pink-50 text-pink-700" },
    { unit: 5, name: "Heredity",                       color: "bg-green-500",   light: "bg-green-50 text-green-700" },
    { unit: 6, name: "Gene Expression",                color: "bg-teal-500",    light: "bg-teal-50 text-teal-700" },
    { unit: 7, name: "Natural Selection",              color: "bg-orange-500",  light: "bg-orange-50 text-orange-700" },
    { unit: 8, name: "Ecology",                        color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700" },
  ]

  const firstName = session.user.name?.split(" ")[0] ?? "there"

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
        <p className="text-gray-500">Here&apos;s how your AP Bio prep is going.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            icon: <BookOpen className="w-5 h-5 text-green-600" />,
            label: "FRQs Completed",
            value: stats?.totalSubmissions ?? 0,
          },
          {
            icon: <Star className="w-5 h-5 text-yellow-500" />,
            label: "Avg FRQ Score",
            value: avgScore != null ? `${avgScore}%` : "—",
          },
          {
            icon: <Brain className="w-5 h-5 text-blue-500" />,
            label: "MCQs Answered",
            value: totalMcqAnswered,
          },
          {
            icon: <Clock className="w-5 h-5 text-purple-500" />,
            label: "Time Spent",
            value: stats ? formatDuration(stats.totalTimeSpentSec) : "0m",
          },
          {
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            label: "Current Streak",
            value: `${stats?.currentStreak ?? 0} day${stats?.currentStreak !== 1 ? "s" : ""}`,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center gap-2">
                {stat.icon}
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DashboardCharts
          scoreOverTime={scoreOverTime}
          topicData={topicChartData}
          mcqCorrect={mcqCorrect}
          mcqIncorrect={mcqIncorrect}
        />
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Practice FRQs
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Get AI feedback on your written answers.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 shrink-0" asChild>
              <Link href="/library">Browse FRQs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                MCQ Practice
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalMcqs} questions across all 8 units.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 shrink-0" asChild>
              <Link href="/mcq">Start Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* MCQ by unit */}
      <div className="mb-2">
        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" />
          MCQ Practice by Unit
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MCQ_UNITS.map(({ unit, name, color, light }) => {
            const count = mcqCountMap.get(unit) ?? 0
            return (
              <Link
                key={unit}
                href={count > 0 ? `/mcq/${unit}` : "/mcq"}
                className="group"
              >
                <div className="rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-200 transition-all overflow-hidden">
                  <div className={`h-1.5 w-full ${color}`} />
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-400 mb-0.5">Unit {unit}</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                      {name}
                    </p>
                    <div className="mt-2">
                      {count > 0 ? (
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${light}`}>
                          {count} Qs
                        </span>
                      ) : (
                        <span className="inline-block text-xs text-gray-400">Coming soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
