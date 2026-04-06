import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatDate, formatDuration } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProgressPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id, status: "GRADED" },
    include: { frq: { include: { topic: true } } },
    orderBy: { submittedAt: "desc" },
    take: 50,
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-500">Your complete submission history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Submissions ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No submissions yet. Complete some FRQs to see your history here.
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const pct =
                  sub.totalScore != null && sub.maxScore
                    ? Math.round((sub.totalScore / sub.maxScore) * 100)
                    : null
                const color =
                  pct == null ? "bg-gray-100 text-gray-500"
                  : pct >= 70 ? "bg-green-100 text-green-700"
                  : pct >= 50 ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"

                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {sub.frq.year} AP Bio · Q{sub.frq.questionNum}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sub.frq.topic.name} · {formatDate(sub.submittedAt)}
                        {sub.timeSpentSec > 0 && ` · ${formatDuration(sub.timeSpentSec)}`}
                      </p>
                    </div>
                    <Badge className={`${color} border-0`}>
                      {pct != null ? `${sub.totalScore}/${sub.maxScore} (${pct}%)` : "—"}
                    </Badge>
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
