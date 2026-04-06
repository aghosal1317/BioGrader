import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const students = await prisma.user.findMany({
    where: { teacherId: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      grade: true,
      mustChangePassword: true,
      createdAt: true,
      userStats: {
        select: {
          totalSubmissions: true,
          currentStreak: true,
        },
      },
      submissions: {
        where: { status: "GRADED" },
        select: { totalScore: true, maxScore: true, submittedAt: true },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(students)
}
