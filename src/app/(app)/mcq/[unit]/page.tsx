import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { MCQQuiz } from "@/components/mcq/MCQQuiz"

interface PageProps {
  params: Promise<{ unit: string }>
}

const UNIT_NAMES: Record<number, string> = {
  1: "Chemistry of Life",
  2: "Cell Structure & Function",
  3: "Cellular Energetics",
  4: "Cell Communication & Cell Cycle",
  5: "Heredity",
  6: "Gene Expression & Regulation",
  7: "Natural Selection",
  8: "Ecology",
}

export default async function MCQUnitPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const { unit } = await params
  const unitNum = parseInt(unit)
  if (isNaN(unitNum) || unitNum < 1 || unitNum > 8) notFound()

  const questions = await prisma.mCQ.findMany({
    where: { unit: unitNum },
    orderBy: { createdAt: "asc" },
  })

  if (questions.length === 0) notFound()

  return (
    <MCQQuiz
      unitNum={unitNum}
      unitName={UNIT_NAMES[unitNum] ?? `Unit ${unitNum}`}
      questions={questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options as { A: string; B: string; C: string; D: string },
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
      }))}
    />
  )
}
