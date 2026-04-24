import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FRQCard } from "@/components/library/FRQCard"
import { FRQFilters } from "@/components/library/FRQFilters"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"
import { Difficulty } from "@prisma/client"

interface PageProps {
  searchParams: Promise<{ year?: string; topicId?: string; difficulty?: string; page?: string }>
}

async function FRQList({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  const params = await searchParams
  const page = parseInt(params.page ?? "1")
  const limit = 20

  const where = {
    ...(params.year ? { year: parseInt(params.year) } : {}),
    ...(params.topicId ? { topicId: params.topicId } : {}),
    ...(params.difficulty ? { difficulty: params.difficulty as Difficulty } : {}),
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

  const frqIds = frqs.map((f) => f.id)
  const lastSubmissions = session
    ? await prisma.submission.findMany({
        where: { userId: session.user.id, frqId: { in: frqIds }, status: "GRADED" },
        orderBy: { submittedAt: "desc" },
        distinct: ["frqId"],
        select: { frqId: true, totalScore: true, maxScore: true, submittedAt: true },
      })
    : []

  const submissionMap = new Map(lastSubmissions.map((s) => [s.frqId, s]))

  if (frqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500">No FRQs found with those filters.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">{total} question{total !== 1 ? "s" : ""} found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {frqs.map((frq) => (
          <FRQCard
            key={frq.id}
            id={frq.id}
            year={frq.year}
            questionNum={frq.questionNum}
            difficulty={frq.difficulty}
            summary={frq.summary}
            topic={frq.topic}
            isOfficial={frq.isOfficial}
            lastSubmission={submissionMap.get(frq.id) ?? null}
          />
        ))}
      </div>
    </>
  )
}

export default function LibraryPage(props: PageProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">FRQ Library</h1>
        <p className="text-gray-500">Browse and practice AP Biology free response questions</p>
      </div>

      <div className="mb-6">
        <Suspense>
          <FRQFilters />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        }
      >
        <FRQList {...props} />
      </Suspense>
    </div>
  )
}
