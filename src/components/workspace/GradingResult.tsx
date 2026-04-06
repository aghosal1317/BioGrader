import { GradingResult as GradingResultType } from "@/types/grading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from "lucide-react"

interface Props {
  result: GradingResultType
  maxScore: number
}

export function GradingResult({ result, maxScore }: Props) {
  const pct = Math.round((result.totalScore / maxScore) * 100)
  const scoreColor =
    pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Your Score</span>
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {result.totalScore}/{maxScore}
              <span className="text-base font-normal text-gray-500 ml-2">({pct}%)</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={pct} className="h-3" />
          <p className="mt-3 text-sm text-gray-600">{result.overallFeedback}</p>
        </CardContent>
      </Card>

      {/* Point Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Point Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.categoryScores.map((cat) => {
            const earned = cat.pointsEarned
            const available = cat.pointsAvailable
            const full = earned === available
            return (
              <div key={cat.categoryId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {full ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{cat.categoryName}</span>
                  </div>
                  <Badge
                    className={`${full ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-0`}
                  >
                    {earned}/{available} pts
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 pl-6">{cat.feedback}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Missing Concepts */}
      {result.missingConcepts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Key Concepts Missed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingConcepts.map((concept) => (
                <Badge key={concept} variant="outline" className="text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Answer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Example Full-Credit Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 whitespace-pre-wrap bg-blue-50 rounded-lg p-4">
            {result.exampleAnswer}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
