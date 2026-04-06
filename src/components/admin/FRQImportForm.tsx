"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Trash2, CheckCircle2, AlertCircle } from "lucide-react"

interface Topic { id: string; name: string; slug: string; apUnit: number }
interface RubricItem { id: string; name: string; points: number; description: string; keywords: string }

const EMPTY_RUBRIC = (): RubricItem => ({
  id: Math.random().toString(36).slice(2),
  name: "",
  points: 2,
  description: "",
  keywords: "",
})

export function FRQImportForm({ topics }: { topics: Topic[] }) {
  const [year, setYear] = useState("")
  const [questionNum, setQuestionNum] = useState("")
  const [type, setType] = useState<"LONG" | "SHORT">("LONG")
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM")
  const [topicSlug, setTopicSlug] = useState("")
  const [totalPoints, setTotalPoints] = useState("10")
  const [summary, setSummary] = useState("")
  const [prompt, setPrompt] = useState("")
  const [source, setSource] = useState("")
  const [rubric, setRubric] = useState<RubricItem[]>([EMPTY_RUBRIC()])
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function updateRubricItem(id: string, field: keyof RubricItem, value: string | number) {
    setRubric(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function removeRubricItem(id: string) {
    setRubric(prev => prev.filter(r => r.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const payload = {
      year: Number(year),
      questionNum: Number(questionNum),
      type,
      difficulty,
      topicSlug,
      totalPoints: Number(totalPoints),
      summary,
      prompt,
      source: source || "College Board",
      rubric: rubric.map((r, i) => ({
        id: `r${i + 1}`,
        name: r.name,
        points: Number(r.points),
        description: r.description,
        keywords: r.keywords.split(",").map(k => k.trim()).filter(Boolean),
      })),
    }

    try {
      const res = await fetch("/api/admin/frq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error ?? "Failed to create FRQ" })
      } else {
        setStatus({ type: "success", msg: `FRQ ${year} Q${questionNum} added successfully!` })
        // Reset form
        setYear(""); setQuestionNum(""); setSummary(""); setPrompt(""); setSource("")
        setRubric([EMPTY_RUBRIC()])
      }
    } catch {
      setStatus({ type: "error", msg: "Network error — please try again" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Metadata row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label>Year *</Label>
          <Input placeholder="e.g. 2023" value={year} onChange={e => setYear(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Question # *</Label>
          <Input placeholder="e.g. 1" value={questionNum} onChange={e => setQuestionNum(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Type *</Label>
          <Select value={type} onValueChange={(v) => setType(v as "LONG" | "SHORT")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LONG">Long FRQ</SelectItem>
              <SelectItem value="SHORT">Short FRQ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "EASY" | "MEDIUM" | "HARD")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Topic *</Label>
          <Select value={topicSlug} onValueChange={setTopicSlug}>
            <SelectTrigger><SelectValue placeholder="Select topic..." /></SelectTrigger>
            <SelectContent>
              {topics.sort((a, b) => a.apUnit - b.apUnit).map(t => (
                <SelectItem key={t.slug} value={t.slug}>
                  Unit {t.apUnit}: {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Total Points</Label>
          <Input type="number" min={1} max={20} value={totalPoints} onChange={e => setTotalPoints(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Source / Citation</Label>
          <Input placeholder="e.g. College Board 2023" value={source} onChange={e => setSource(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Short Summary</Label>
        <Input placeholder="One-line description of what this FRQ covers" value={summary} onChange={e => setSummary(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label>Question Prompt *</Label>
        <p className="text-xs text-gray-500">Paste the full question text, including all parts (a), (b), etc.</p>
        <Textarea
          className="min-h-[200px] font-mono text-sm"
          placeholder="Paste the full FRQ text here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
      </div>

      {/* Rubric builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Rubric Criteria *</Label>
            <p className="text-xs text-gray-500 mt-0.5">Add one item per graded part. Keywords help the AI identify correct answers.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setRubric(p => [...p, EMPTY_RUBRIC()])}>
            <PlusCircle className="w-4 h-4 mr-1.5" /> Add Criterion
          </Button>
        </div>

        {rubric.map((item, idx) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Part {idx + 1}</Badge>
              {rubric.length > 1 && (
                <button type="button" onClick={() => removeRubricItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Criterion Name</Label>
                <Input
                  placeholder="e.g. Part A – ATP and energy flow"
                  value={item.name}
                  onChange={e => updateRubricItem(item.id, "name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Points</Label>
                <Input
                  type="number" min={1} max={10}
                  value={item.points}
                  onChange={e => updateRubricItem(item.id, "points", Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">What earns full credit</Label>
              <Textarea
                className="min-h-[70px] text-sm"
                placeholder="Describe what a complete, correct answer looks like for this part."
                value={item.description}
                onChange={e => updateRubricItem(item.id, "description", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Keywords (comma-separated)</Label>
              <Input
                placeholder="e.g. ATP, chloroplast, mitochondria, electron transport chain"
                value={item.keywords}
                onChange={e => updateRubricItem(item.id, "keywords", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {status && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
        {loading ? "Saving..." : "Add FRQ to Library"}
      </Button>
    </form>
  )
}
