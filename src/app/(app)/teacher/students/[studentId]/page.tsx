import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { formatDate, formatDuration } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GradingResult } from "@/types/grading"
import { ArrowLeft, BookOpen, Brain, Clock, Star } from "lucide-react"

interface PageProps {
  params: Promise<{ studentId: string }>
}

export default async function StudentDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "TEACHER") redirect("/dashboard")

  const { studentId } = await params

  const [student, mcqAttemptStats, mcqUnitRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId, teacherId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        grade: true,
        mustChangePassword: true,
        createdAt: true,
        userStats: true,
        submissions: {
          where: { status: "GRADED" },
          include: { frq: { include: { topic: true } } },
          orderBy: { submittedAt: "desc" },
        },
      },
    }),
    // Overall correct/incorrect split
    prisma.mCQAttempt.groupBy({
      by: ["correct"],
      where: { userId: studentId },
      _count: { id: true },
    }),
    // Per-unit breakdown (unit + correct combo)
    prisma.mCQAttempt.groupBy({
      by: ["unit", "correct"],
      where: { userId: studentId },
      _count: { id: true },
      orderBy: { unit: "asc" },
    }),
  ])

  if (!student) notFound()

  const mcqCorrect = mcqAttemptStats.find((s) => s.correct)?._count.id ?? 0
  const mcqIncorrect = mcqAttemptStats.find((s) => !s.correct)?._count.id ?? 0
  const totalMcqAnswered = mcqCorrect + mcqIncorrect
  const mcqAccuracy = totalMcqAnswered > 0 ? Math.round((mcqCorrect / totalMcqAnswered) * 100) : null

  // Reshape per-unit rows into { unit, correct, incorrect }
  const unitMap = new Map<number, { correct: number; incorrect: number }>()
  for (const row of mcqUnitRows) {
    const existing = unitMap.get(row.unit) ?? { correct: 0, incorrect: 0 }
    if (row.correct) existing.correct += row._count.id
    else existing.incorrect += row._count.id
    unitMap.set(row.unit, existing)
  }
  const mcqUnitData = Array.from(unitMap.entries())
    .map(([unit, counts]) => ({ unit, ...counts, total: counts.correct + counts.incorrect }))
    .sort((a, b) => a.unit - b.unit)

  const avgScore = student.submissions.length > 0
    ? Math.round(
        student.submissions.reduce((sum, s) =>
          sum + (s.totalScore && s.maxScore ? (s.totalScore / s.maxScore) * 100 : 0), 0
        ) / student.submissions.length
      )
    : null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teacher">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-500 text-sm">{student.email}
            {student.grade && ` · Grade ${student.grade}`}
            {student.mustChangePassword && (
              <span className="ml-2 text-yellow-600 font-medium">· Needs to change password</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          {
            icon: <BookOpen className="w-5 h-5 text-green-600" />,
            label: "FRQs Completed",
            value: student.submissions.length,
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
            icon: <Star className="w-5 h-5 text-green-500" />,
            label: "MCQ Accuracy",
            value: mcqAccuracy != null ? `${mcqAccuracy}%` : "—",
          },
          {
            icon: <Clock className="w-5 h-5 text-purple-500" />,
            label: "Time Spent",
            value: student.userStats
              ? formatDuration(student.userStats.totalTimeSpentSec as number)
              : "0m",
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
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MCQ breakdown by unit */}
      {mcqUnitData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              MCQ Performance by Unit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mcqUnitData.map(({ unit, correct, incorrect, total }) => {
                const pct = Math.round((correct / total) * 100)
                return (
                  <div key={unit}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Unit {unit}</span>
                      <span className={`font-semibold ${pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                        {correct}/{total} correct ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          {student.submissions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No submissions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {student.submissions.map((sub) => {
                const pct = sub.totalScore && sub.maxScore
                  ? Math.round((sub.totalScore / sub.maxScore) * 100)
                  : null
                const grading = sub.gradingResult as unknown as GradingResult | null
                const color = pct == null ? "bg-gray-100 text-gray-500"
                  : pct >= 70 ? "bg-green-100 text-green-700"
                  : pct >= 50 ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"

                return (
                  <div key={sub.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">
                          {sub.frq.year} AP Bio · Q{sub.frq.questionNum} — {sub.frq.topic.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Submitted {formatDate(sub.submittedAt)}
                          {sub.timeSpentSec > 0 && ` · ${formatDuration(sub.timeSpentSec)}`}
                        </p>
                      </div>
                      <Badge className={`${color} border-0`}>
                        {pct != null ? `${sub.totalScore}/${sub.maxScore} (${pct}%)` : "—"}
                      </Badge>
                    </div>

                    {/* Student's answer */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Student Answer</p>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
                        {sub.answerText || <span className="text-gray-400 italic">No answer text</span>}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {grading && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Feedback</p>
                        <p className="text-sm text-gray-600 bg-blue-50 rounded p-3">{grading.overallFeedback}</p>
                        {grading.missingConcepts.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-xs text-gray-400">Missing concepts:</span>
                            {grading.missingConcepts.map((c) => (
                              <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
