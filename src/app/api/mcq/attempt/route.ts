import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { mcqId, answer, correct, unit } = await req.json()

    if (!mcqId || !answer || correct === undefined || unit === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const attempt = await prisma.mCQAttempt.create({
      data: {
        userId: session.user.id,
        mcqId,
        answer,
        correct: Boolean(correct),
        unit: Number(unit),
      },
    })

    return NextResponse.json({ success: true, attempt })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 })
  }
}
