import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { studentId } = await params

  const student = await prisma.user.findUnique({
    where: { id: studentId, teacherId: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      grade: true,
      mustChangePassword: true,
      createdAt: true,
      userStats: true,
      submissions: {
        where: { status: "GRADED" },
        include: { frq: { include: { topic: true } } },
        orderBy: { submittedAt: "desc" },
      },
    },
  })

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })

  return NextResponse.json(student)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { studentId } = await params

  // Verify the student belongs to this teacher before deleting
  const student = await prisma.user.findUnique({
    where: { id: studentId, teacherId: session.user.id },
    select: { id: true, name: true },
  })

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })

  // Delete the student and all their data (cascades via schema)
  await prisma.user.delete({ where: { id: studentId } })

  return NextResponse.json({ success: true, name: student.name })
}
