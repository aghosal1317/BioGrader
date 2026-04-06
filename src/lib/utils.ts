import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

// Recursively extract plain text from a TipTap/ProseMirror JSON document
export function tiptapToPlainText(json: Record<string, unknown>): string {
  if (!json || typeof json !== "object") return ""

  if (json.type === "text" && typeof json.text === "string") {
    return json.text
  }

  const content = json.content as Record<string, unknown>[] | undefined
  if (!Array.isArray(content)) return ""

  const blockTypes = new Set([
    "paragraph",
    "heading",
    "bulletList",
    "orderedList",
    "blockquote",
  ])

  return content
    .map((node) => {
      const text = tiptapToPlainText(node)
      if (blockTypes.has(node.type as string)) return text + "\n"
      return text
    })
    .join("")
    .trim()
}
