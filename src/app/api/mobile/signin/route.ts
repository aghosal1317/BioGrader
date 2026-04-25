import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { encode } from "next-auth/jwt"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// POST /api/mobile/signin — returns a NextAuth-compatible JWT for mobile clients
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Encode a NextAuth-compatible JWT so the mobile app can use it as a session cookie
  const token = await encode({
    token: {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.image,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    // 30-day expiry (matches NextAuth default session maxAge)
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  })
}
