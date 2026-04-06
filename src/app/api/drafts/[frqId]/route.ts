import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ frqId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { frqId } = await params
  const draft = await prisma.draft.findUnique({
    where: { userId_frqId: { userId: session.user.id, frqId } },
  })

  return NextResponse.json(draft)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ frqId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { frqId } = await params
  const { content } = await req.json()

  const draft = await prisma.draft.upsert({
    where: { userId_frqId: { userId: session.user.id, frqId } },
    update: { content },
    create: { userId: session.user.id, frqId, content },
  })

  return NextResponse.json(draft)
}
