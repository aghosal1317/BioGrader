"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const TOPICS = [
  { id: "chemistry-of-life", name: "Chemistry of Life" },
  { id: "cell-structure", name: "Cell Structure & Function" },
  { id: "cellular-energetics", name: "Cellular Energetics" },
  { id: "cell-communication", name: "Cell Communication" },
  { id: "heredity", name: "Heredity" },
  { id: "gene-expression", name: "Gene Expression & Regulation" },
  { id: "natural-selection", name: "Natural Selection" },
  { id: "ecology", name: "Ecology" },
]

const YEARS = Array.from({ length: 15 }, (_, i) => 2024 - i)

export function FRQFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete("page")
      router.push(`/library?${params.toString()}`)
    },
    [router, searchParams]
  )

  const hasFilters =
    searchParams.has("year") ||
    searchParams.has("topicId") ||
    searchParams.has("difficulty")

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={searchParams.get("year") ?? "all"}
        onValueChange={(v) => setFilter("year", v)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All years</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("topicId") ?? "all"}
        onValueChange={(v) => setFilter("topicId", v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All topics</SelectItem>
          {TOPICS.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("difficulty") ?? "all"}
        onValueChange={(v) => setFilter("difficulty", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="EASY">Easy</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HARD">Hard</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/library")}
          className="text-gray-500"
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
