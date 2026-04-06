"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  scoreOverTime: { week: string; avgScore: number }[]
  topicData: { topic: string; avgScore: number; attempts: number }[]
  mcqCorrect: number
  mcqIncorrect: number
}

export function DashboardCharts({ scoreOverTime, topicData, mcqCorrect, mcqIncorrect }: Props) {
  const mcqTotal = mcqCorrect + mcqIncorrect
  const mcqPct = mcqTotal > 0 ? Math.round((mcqCorrect / mcqTotal) * 100) : null
  const pieData = [
    { name: "Correct", value: mcqCorrect, color: "#16a34a" },
    { name: "Incorrect", value: mcqIncorrect, color: "#f87171" },
  ]

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">FRQ Score Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {scoreOverTime.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              Complete some FRQs to see your progress
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={scoreOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ fill: "#16a34a", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">FRQ Score by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          {topicData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              Complete some FRQs to see topic breakdown
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={topicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="topic" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                <Bar dataKey="avgScore" fill="#16a34a" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">MCQ Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          {mcqTotal === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              Answer some MCQs to see your accuracy
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-gray-900">{mcqPct}%</p>
                  <p className="text-sm text-gray-500">accuracy</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                      <span className="text-gray-600">Correct</span>
                    </div>
                    <span className="font-semibold text-green-700">{mcqCorrect}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                      <span className="text-gray-600">Incorrect</span>
                    </div>
                    <span className="font-semibold text-red-500">{mcqIncorrect}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-2">
                    <span className="text-gray-500">Total answered</span>
                    <span className="font-semibold">{mcqTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
