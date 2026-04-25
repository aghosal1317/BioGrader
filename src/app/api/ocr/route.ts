import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { anthropic } from "@/lib/anthropic"
import { put } from "@vercel/blob"
import { z } from "zod"

export const maxDuration = 30

const schema = z.object({
  imageBase64: z.string(),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const { imageBase64, mimeType } = parsed.data

  // Upload image to Vercel Blob for persistent storage
  const buffer = Buffer.from(imageBase64, "base64")
  const ext = mimeType.split("/")[1].replace("jpeg", "jpg")
  const blob = await put(
    `submissions/${session.user.id}/${Date.now()}.${ext}`,
    buffer,
    { access: "public", contentType: mimeType }
  )

  // Use Claude vision to extract handwritten text
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: imageBase64 },
          },
          {
            type: "text",
            text: "This is a photo of a student's handwritten AP Biology free-response answer. Transcribe all the written text exactly as it appears, preserving paragraph and line breaks. Include all words, labels, and annotations visible in the image. Return only the transcribed text with no commentary, preamble, or formatting additions.",
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""

  return NextResponse.json({ text, imageUrl: blob.url })
}
