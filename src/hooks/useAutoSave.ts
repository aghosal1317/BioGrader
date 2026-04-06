import { useEffect, useRef } from "react"

export function useAutoSave(
  frqId: string,
  content: Record<string, unknown> | null,
  delay = 3000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string>("")

  useEffect(() => {
    if (!content) return
    const serialized = JSON.stringify(content)
    if (serialized === lastSavedRef.current) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      await fetch(`/api/drafts/${frqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      lastSavedRef.current = serialized
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [frqId, content, delay])
}
