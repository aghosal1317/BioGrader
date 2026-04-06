import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  grade: true,
  subjectInterests: true,
  school: true,
  county: true,
  state: true,
  schoolType: true,
  classSection: true,
  schoolYear: true,
  apExamYear: true,
  timezone: true,
} as const

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: PROFILE_SELECT,
  })

  return NextResponse.json(user)
}

const patchSchema = z.object({
  name:         z.string().min(1).max(100).optional(),
  grade:        z.number().int().min(9).max(12).nullish(),
  school:       z.string().max(200).nullish(),
  county:       z.string().max(200).nullish(),
  state:        z.string().max(100).nullish(),
  schoolType:   z.enum(["public", "private", "charter", "homeschool", "other"]).nullish(),
  classSection: z.string().max(100).nullish(),
  schoolYear:   z.string().max(20).nullish(),
  apExamYear:   z.number().int().min(2020).max(2040).nullish(),
  timezone:     z.string().max(100).nullish(),
  subjectInterests: z.array(z.string()).optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: PROFILE_SELECT,
  })

  return NextResponse.json(user)
}
