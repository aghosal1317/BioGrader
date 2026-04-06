import { useEffect, useRef, useState } from "react"

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActiveRef = useRef(false)

  function resetIdle() {
    if (idleRef.current) clearTimeout(idleRef.current)
    if (!isActiveRef.current) {
      isActiveRef.current = true
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    idleRef.current = setTimeout(() => {
      isActiveRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }, 30000) // pause after 30s idle
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (idleRef.current) clearTimeout(idleRef.current)
    }
  }, [])

  return { seconds, resetIdle }
}
