import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import Papa from "papaparse"
import { z } from "zod"

const rowSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Only teachers can import students" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

  const text = await file.text()
  const { data, errors } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  if (errors.length > 0) {
    return NextResponse.json({ error: "CSV parse error", details: errors }, { status: 400 })
  }

  const results = {
    created: 0,
    skipped: 0,
    errors: [] as string[],
    // Credential sheet returned to teacher — plain passwords never stored after this response
    credentials: [] as { name: string; email: string; temporaryPassword: string }[],
  }

  for (const row of data) {
    const parsed = rowSchema.safeParse({
      name: row.name ?? row["full name"] ?? row["student name"],
      email: row.email,
      password: row.password ?? row["default password"],
    })

    if (!parsed.success) {
      results.errors.push(`Row skipped (invalid data): ${JSON.stringify(row)}`)
      results.skipped++
      continue
    }

    const { name, email, password } = parsed.data
    const lowerEmail = email.toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email: lowerEmail } })
    if (existing) {
      results.errors.push(`${lowerEmail} already exists — skipped`)
      results.skipped++
      continue
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        passwordHash,
        role: "STUDENT",
        mustChangePassword: true,
        teacherId: session.user.id,
      },
    })
    results.created++
    results.credentials.push({ name, email: lowerEmail, temporaryPassword: password })
  }

  return NextResponse.json(results)
}
