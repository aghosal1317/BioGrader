"use client"

import { useState, useRef } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Download, Upload, FileText } from "lucide-react"

const UNIT_SLUGS: Record<number, string> = {
  1: "chemistry-of-life",
  2: "cell-structure",
  3: "cellular-energetics",
  4: "cell-communication",
  5: "heredity",
  6: "gene-expression",
  7: "natural-selection",
  8: "ecology",
}

const UNIT_NAMES: Record<number, string> = {
  1: "Chemistry of Life",
  2: "Cell Structure & Function",
  3: "Cellular Energetics",
  4: "Cell Communication & Cell Cycle",
  5: "Heredity",
  6: "Gene Expression & Regulation",
  7: "Natural Selection",
  8: "Ecology",
}

const CSV_TEMPLATE_HEADERS = [
  "question", "optionA", "optionB", "optionC", "optionD",
  "answer", "explanation", "unit", "difficulty", "year"
]

const CSV_EXAMPLE_ROW = [
  "Which organelle is responsible for ATP production?",
  "Nucleus",
  "Ribosome",
  "Mitochondria",
  "Golgi apparatus",
  "C",
  "Mitochondria are the site of aerobic cellular respiration and produce most of the cell's ATP via oxidative phosphorylation.",
  "3",
  "EASY",
  "2022"
]

function downloadTemplate() {
  const csv = [CSV_TEMPLATE_HEADERS.join(","), CSV_EXAMPLE_ROW.map(v => `"${v}"`).join(",")].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "mcq_import_template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// ── Single MCQ Form ──────────────────────────────────────────────────────────

function SingleMCQForm() {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" })
  const [answer, setAnswer] = useState("")
  const [explanation, setExplanation] = useState("")
  const [unit, setUnit] = useState("")
  const [difficulty, setDifficulty] = useState("MEDIUM")
  const [year, setYear] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const payload = {
      question,
      optionA: options.A,
      optionB: options.B,
      optionC: options.C,
      optionD: options.D,
      answer,
      explanation,
      unit: Number(unit),
      topicSlug: UNIT_SLUGS[Number(unit)],
      difficulty,
      year: year ? Number(year) : null,
    }

    try {
      const res = await fetch("/api/admin/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error ?? "Failed to create MCQ" })
      } else {
        setStatus({ type: "success", msg: "MCQ added successfully!" })
        setQuestion(""); setOptions({ A: "", B: "", C: "", D: "" })
        setAnswer(""); setExplanation(""); setYear("")
      }
    } catch {
      setStatus({ type: "error", msg: "Network error — please try again" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Question *</Label>
        <Textarea
          className="min-h-[100px]"
          placeholder="Enter the MCQ question text..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Answer Options *</Label>
        {(["A", "B", "C", "D"] as const).map(letter => (
          <div key={letter} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              answer === letter ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              {letter}
            </div>
            <Input
              placeholder={`Option ${letter}`}
              value={options[letter]}
              onChange={e => setOptions(p => ({ ...p, [letter]: e.target.value }))}
              required
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label>Correct Answer *</Label>
          <Select value={answer} onValueChange={setAnswer}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {["A", "B", "C", "D"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>AP Bio Unit *</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue placeholder="Unit..." /></SelectTrigger>
            <SelectContent>
              {Object.entries(UNIT_NAMES).map(([u, name]) => (
                <SelectItem key={u} value={u}>Unit {u}: {name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Year (optional)</Label>
          <Input placeholder="e.g. 2023" value={year} onChange={e => setYear(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Explanation *</Label>
        <Textarea
          className="min-h-[100px]"
          placeholder="Explain why the correct answer is right and why the others are wrong..."
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          required
        />
      </div>

      {status && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          status.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
        {loading ? "Saving..." : "Add MCQ"}
      </Button>
    </form>
  )
}

// ── Bulk CSV Form ────────────────────────────────────────────────────────────

function BulkMCQForm() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setStatus(null)

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        setPreview(results.data.slice(0, 5))
      },
    })
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setLoading(true)
    setStatus(null)

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      async complete(results) {
        try {
          const res = await fetch("/api/admin/mcq", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.data),
          })
          const data = await res.json()
          if (!res.ok) {
            setStatus({ type: "error", msg: data.error ?? "Upload failed" })
          } else {
            const errCount = data.errors?.length ?? 0
            setStatus({
              type: errCount > 0 ? "error" : "success",
              msg: errCount > 0
                ? `${data.created} added, ${errCount} errors: ${data.errors.slice(0, 3).join("; ")}`
                : `Successfully imported ${data.created} MCQs!`,
            })
            setPreview([])
            setFileName("")
            if (fileRef.current) fileRef.current.value = ""
          }
        } catch {
          setStatus({ type: "error", msg: "Network error" })
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-blue-800">How to use CSV import</p>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Download the CSV template below</li>
          <li>Fill in one MCQ per row (keep the header row)</li>
          <li>
            <strong>answer</strong> column must be A, B, C, or D &nbsp;·&nbsp;
            <strong>unit</strong> must be 1–8 &nbsp;·&nbsp;
            <strong>difficulty</strong>: EASY, MEDIUM, or HARD
          </li>
          <li>Upload the completed file</li>
        </ol>
        <Button type="button" variant="outline" size="sm" onClick={downloadTemplate} className="border-blue-300 text-blue-700 hover:bg-blue-100">
          <Download className="w-4 h-4 mr-1.5" /> Download CSV Template
        </Button>
      </div>

      {/* College Board tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Getting official College Board questions</p>
        <p className="text-sm text-amber-700">
          Official AP Biology FRQs are free at{" "}
          <a
            href="https://apstudents.collegeboard.org/courses/ap-biology/free-response-questions-by-year"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium"
          >
            College Board&rsquo;s website
          </a>
          . Official MCQs from past exams are secured, but the{" "}
          <a
            href="https://apcentral.collegeboard.org/media/pdf/ap-biology-course-and-exam-description.pdf"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium"
          >
            Course &amp; Exam Description (CED)
          </a>{" "}
          includes ~20 official sample MCQs you can add here.
          When adding official content, set the source/citation to: <em>&ldquo;AP® Biology Free-Response Questions © [Year] College Board&rdquo;</em>
        </p>
      </div>

      {/* File picker */}
      <div className="space-y-3">
        <Label>Upload CSV File</Label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-green-700">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{fileName}</span>
              {preview.length > 0 && <Badge className="bg-green-100 text-green-700">{preview.length}+ rows previewed</Badge>}
            </div>
          ) : (
            <div className="text-gray-500">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">Click to select a CSV file</p>
              <p className="text-xs mt-1">or drag and drop</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="space-y-2">
          <Label>Preview (first {preview.length} rows)</Label>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {Object.keys(preview[0]).map(h => (
                    <th key={h} className="px-3 py-2 text-left text-gray-600 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {status && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
          status.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <span>{status.msg}</span>
        </div>
      )}

      <Button
        type="button"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={loading || !fileName}
        onClick={handleUpload}
      >
        {loading ? "Importing..." : `Import MCQs from CSV`}
      </Button>
    </div>
  )
}

// ── Exported component ────────────────────────────────────────────────────────

export function MCQImportForm() {
  return (
    <Tabs defaultValue="single">
      <TabsList className="mb-6">
        <TabsTrigger value="single">Single Question</TabsTrigger>
        <TabsTrigger value="bulk">Bulk CSV Import</TabsTrigger>
      </TabsList>
      <TabsContent value="single"><SingleMCQForm /></TabsContent>
      <TabsContent value="bulk"><BulkMCQForm /></TabsContent>
    </Tabs>
  )
}
