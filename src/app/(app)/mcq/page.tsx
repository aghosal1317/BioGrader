import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ChevronRight, Lock } from "lucide-react"

const UNITS = [
  { unit: 1, name: "Chemistry of Life", emoji: "⚗️", color: "from-blue-500 to-blue-600" },
  { unit: 2, name: "Cell Structure & Function", emoji: "🔬", color: "from-purple-500 to-purple-600" },
  { unit: 3, name: "Cellular Energetics", emoji: "⚡", color: "from-yellow-500 to-orange-500" },
  { unit: 4, name: "Cell Communication & Cell Cycle", emoji: "📡", color: "from-pink-500 to-rose-600" },
  { unit: 5, name: "Heredity", emoji: "🧬", color: "from-green-500 to-green-600" },
  { unit: 6, name: "Gene Expression & Regulation", emoji: "🔑", color: "from-teal-500 to-teal-600" },
  { unit: 7, name: "Natural Selection", emoji: "🦋", color: "from-orange-500 to-orange-600" },
  { unit: 8, name: "Ecology", emoji: "🌿", color: "from-emerald-500 to-emerald-600" },
]

export default async function MCQPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  // Count questions per unit
  const counts = await prisma.mCQ.groupBy({
    by: ["unit"],
    _count: { id: true },
  })
  const countMap = new Map(counts.map((c) => [c.unit, c._count.id]))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MCQ Practice</h1>
          <p className="text-gray-500 text-sm">Multiple choice questions organized by AP Bio unit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {UNITS.map(({ unit, name, emoji, color }) => {
          const count = countMap.get(unit) ?? 0
          const available = count > 0

          return (
            <Link
              key={unit}
              href={available ? `/mcq/${unit}` : "#"}
              className={available ? "group" : "cursor-not-allowed opacity-60"}
            >
              <Card className={`overflow-hidden transition-all ${available ? "hover:shadow-md hover:border-green-200 group-hover:-translate-y-0.5" : ""}`}>
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${color} p-4 flex items-center gap-3`}>
                    <span className="text-3xl">{emoji}</span>
                    <div className="text-white">
                      <p className="text-xs font-medium opacity-80">Unit {unit}</p>
                      <p className="font-bold leading-tight">{name}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {available ? (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          {count} questions
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Lock className="w-3 h-3" />
                          Coming soon
                        </div>
                      )}
                    </div>
                    {available && (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
