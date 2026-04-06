import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { year, questionNum, type, difficulty, topicSlug, totalPoints, summary, prompt, rubric, source } = body

    if (!year || !questionNum || !type || !topicSlug || !prompt || !rubric?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } })
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 })

    // Check for duplicate
    const existing = await prisma.fRQ.findUnique({
      where: { year_questionNum: { year: Number(year), questionNum: Number(questionNum) } },
    })
    if (existing) {
      return NextResponse.json({ error: `FRQ ${year} Q${questionNum} already exists` }, { status: 409 })
    }

    const frq = await prisma.fRQ.create({
      data: {
        year: Number(year),
        questionNum: Number(questionNum),
        type,
        difficulty: difficulty ?? "MEDIUM",
        topicId: topic.id,
        totalPoints: Number(totalPoints) || 10,
        summary: summary ?? "",
        prompt,
        rubric,
        imageUrls: [],
        source: source ?? "User-imported",
        isOfficial: false,
      },
    })

    return NextResponse.json({ success: true, frq })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create FRQ" }, { status: 500 })
  }
}
