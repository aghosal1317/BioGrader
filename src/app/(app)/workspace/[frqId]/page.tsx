import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { WorkspaceClient } from "./WorkspaceClient"

interface PageProps {
  params: Promise<{ frqId: string }>
}

export default async function WorkspacePage({ params }: PageProps) {
  const { frqId } = await params
  const session = await getServerSession(authOptions)

  const [frq, draft] = await Promise.all([
    prisma.fRQ.findUnique({
      where: { id: frqId },
      include: { topic: true },
    }),
    session
      ? prisma.draft.findUnique({
          where: { userId_frqId: { userId: session.user.id, frqId } },
        })
      : null,
  ])

  if (!frq) notFound()

  return (
    <WorkspaceClient
      frq={{
        id: frq.id,
        year: frq.year,
        questionNum: frq.questionNum,
        prompt: frq.prompt,
        totalPoints: frq.totalPoints,
        topic: frq.topic,
        rubric: frq.rubric,
      }}
      initialDraft={draft?.content ?? null}
    />
  )
}
