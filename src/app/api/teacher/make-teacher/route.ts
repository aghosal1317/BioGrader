// Temporary endpoint to promote your own account to TEACHER role.
// Hit this once, then you can delete it.
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "TEACHER" },
  })

  return NextResponse.json({ success: true, message: "You are now a Teacher. Please log out and back in." })
}
