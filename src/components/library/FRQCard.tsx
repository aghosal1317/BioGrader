import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, Star } from "lucide-react"

interface FRQCardProps {
  id: string
  year: number
  questionNum: number
  difficulty: "EASY" | "MEDIUM" | "HARD"
  summary?: string | null
  topic: { name: string }
  lastSubmission?: {
    totalScore: number | null
    maxScore: number | null
    submittedAt: Date | string
  } | null
}

const difficultyConfig = {
  EASY: { label: "Easy", className: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400" },
  HARD: { label: "Hard", className: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" },
}

export function FRQCard({
  id,
  year,
  questionNum,
  difficulty,
  summary,
  topic,
  lastSubmission,
}: FRQCardProps) {
  const diff = difficultyConfig[difficulty]
  const score =
    lastSubmission?.totalScore != null && lastSubmission?.maxScore
      ? Math.round((lastSubmission.totalScore / lastSubmission.maxScore) * 100)
      : null

  return (
    <Link href={`/workspace/${id}`}>
      <Card className="h-full hover:shadow-md hover:border-green-200 transition-all cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{year} · Q{questionNum}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                {topic.name}
              </h3>
            </div>
            <Badge className={`${diff.className} shrink-0 border-0`}>{diff.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {summary && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{summary}</p>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t">
          {lastSubmission ? (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Star className="w-3.5 h-3.5 text-green-600" />
              <span>
                Last score: <span className="font-semibold text-green-600">{score}%</span>
                {" · "}
                {formatDate(lastSubmission.submittedAt)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Not attempted yet</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
