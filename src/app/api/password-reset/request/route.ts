import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email/mailer"
import { addHours } from "date-fns"
import { z } from "zod"

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const { email } = parsed.data
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

  // Always return success to avoid leaking whether the email exists
  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: true })
  }

  // Invalidate old tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  })

  const reset = await prisma.passwordReset.create({
    data: {
      userId: user.id,
      expires: addHours(new Date(), 1),
    },
  })

  await sendPasswordResetEmail(email, reset.token)

  return NextResponse.json({ success: true })
}
