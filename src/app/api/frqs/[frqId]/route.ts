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
  const frq = await prisma.fRQ.findUnique({
    where: { id: frqId },
    include: { topic: true },
  })

  if (!frq) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(frq)
}
