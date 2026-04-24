"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AnswerEditor } from "@/components/workspace/AnswerEditor"
import { GradingResult } from "@/components/workspace/GradingResult"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useTimer } from "@/hooks/useTimer"
import { formatDuration } from "@/lib/utils"
import { GradingResult as GradingResultType } from "@/types/grading"
import { toast } from "sonner"
import { ArrowLeft, Clock, Save, Send, Loader2, RotateCcw, ShieldCheck, History, ChevronDown, ChevronUp } from "lucide-react"

interface PastSubmission {
  id: string
  totalScore: number | null
  maxScore: number | null
  gradingResult: unknown
  answerText: string
  submittedAt: string
  timeSpentSec: number
}

interface WorkspaceClientProps {
  frq: {
    id: string
    year: number
    questionNum: number
    prompt: string
    totalPoints: number
    topic: { name: string }
    rubric: unknown
    imageUrls: string[]
    isOfficial: boolean
    source: string | null
  }
  initialDraft: unknown
}

export function WorkspaceClient({ frq, initialDraft }: WorkspaceClientProps) {
  const router = useRouter()
  const [content, setContent] = useState<Record<string, unknown> | null>(
    (initialDraft as Record<string, unknown>) ?? null
  )
  const [submitting, setSubmitting] = useState(false)
  const [gradingResult, setGradingResult] = useState<GradingResultType | null>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  // Incrementing this key remounts AnswerEditor with blank content on retry
  const [editorKey, setEditorKey] = useState(0)

  // Past answers panel
  const [pastOpen, setPastOpen] = useState(false)
  const [pastSubmissions, setPastSubmissions] = useState<PastSubmission[]>([])
  const [loadingPast, setLoadingPast] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { seconds, resetIdle } = useTimer()
  useAutoSave(frq.id, content, 3000)

  const handleSaveDraft = useCallback(async () => {
    if (!content) return
    await fetch(`/api/drafts/${frq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    toast.success("Draft saved")
  }, [frq.id, content])

  const handleSubmit = useCallback(async () => {
    if (!content) {
      toast.error("Please write an answer before submitting")
      return
    }

    setSubmitting(true)

    try {
      // 1. Create submission
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frqId: frq.id, content, timeSpentSec: seconds }),
      })

      if (!subRes.ok) throw new Error("Failed to create submission")
      const submission = await subRes.json()
      setSubmissionId(submission.id)

      // 2. Grade it
      const gradeRes = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id }),
      })

      if (!gradeRes.ok) {
        const errData = await gradeRes.json().catch(() => ({}))
        throw new Error(errData?.error ?? "Grading failed")
      }
      const graded = await gradeRes.json()
      setGradingResult(graded.gradingResult as GradingResultType)

      // 3. Clear draft so editor starts blank next visit
      fetch(`/api/drafts/${frq.id}`, { method: "DELETE" }).catch(() => null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Grading failed. Please try again."
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }, [content, frq.id, seconds])

  const handleRetry = () => {
    setGradingResult(null)
    setSubmissionId(null)
    setContent(null)
    setEditorKey((k) => k + 1) // remount editor blank
  }

  const openPastAnswers = useCallback(async () => {
    setPastOpen(true)
    if (pastSubmissions.length > 0) return // already loaded
    setLoadingPast(true)
    try {
      const res = await fetch(`/api/submissions?frqId=${frq.id}`)
      const data = await res.json()
      setPastSubmissions(data)
    } catch {
      toast.error("Could not load past answers")
    } finally {
      setLoadingPast(false)
    }
  }, [frq.id, pastSubmissions.length])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-background border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Library
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div>
            <span className="font-semibold text-foreground">{frq.year} AP Biology</span>
            <span className="text-muted-foreground mx-2">·</span>
            <span className="text-muted-foreground">Q{frq.questionNum}</span>
            <span className="text-muted-foreground mx-2">·</span>
            <span className="text-muted-foreground">{frq.topic.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatDuration(seconds)}
          </div>
          <Badge variant="outline">{frq.totalPoints} pts</Badge>
          <Button variant="outline" size="sm" onClick={openPastAnswers}>
            <History className="w-4 h-4 mr-1" />
            Past answers
          </Button>
          {!gradingResult && (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={submitting}>
                <Save className="w-4 h-4 mr-1" />
                Save draft
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Grading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Submit for grading
                  </>
                )}
              </Button>
            </>
          )}
          {gradingResult && (
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Try again
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-border bg-background">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Question
          </h2>
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
            {frq.prompt}
          </div>

          {/* Figures */}
          {frq.imageUrls.length > 0 && (
            <div className="mt-6 space-y-4">
              {frq.imageUrls.map((url, i) => (
                <figure key={url} className="border rounded-lg overflow-hidden bg-white">
                  <Image
                    src={url}
                    alt={`Figure ${i + 1} for ${frq.year} AP Biology Q${frq.questionNum}`}
                    width={1100}
                    height={900}
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                  <figcaption className="px-3 py-1.5 text-[11px] text-gray-500 bg-gray-50 border-t text-center">
                    Figure {i + 1}
                    {frq.isOfficial && (
                      <> · © {frq.year} College Board. All rights reserved.</>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Copyright notice for official questions */}
          {frq.isOfficial && (
            <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Official College Board Question</span>
                <br />
                AP® Biology Free-Response Questions © {frq.year} College Board. All rights reserved.
                AP® is a registered trademark of College Board. Used for educational purposes only.
                {frq.source && <><br /><span className="opacity-75">{frq.source}</span></>}
              </div>
            </div>
          )}
        </div>

        {/* Right: Answer / Result */}
        <div className="w-1/2 overflow-y-auto p-6 bg-muted">
          {gradingResult ? (
            <>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Grading Result
              </h2>
              <GradingResult result={gradingResult} maxScore={frq.totalPoints} />
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Your Answer
              </h2>
              {submitting ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-3" />
                  <p className="font-medium text-foreground">Grading your answer...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Claude is reviewing your response against the rubric
                  </p>
                </div>
              ) : (
                <AnswerEditor
                  key={editorKey}
                  initialContent={content}
                  onChange={setContent}
                  onActivity={resetIdle}
                  disabled={submitting}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Past Answers Dialog */}
      <Dialog open={pastOpen} onOpenChange={setPastOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Past Answers — {frq.year} AP Bio Q{frq.questionNum}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loadingPast && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!loadingPast && pastSubmissions.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">
                No graded submissions yet for this question.
              </p>
            )}

            {!loadingPast && pastSubmissions.map((sub, i) => {
              const pct = sub.totalScore != null && sub.maxScore
                ? Math.round((sub.totalScore / sub.maxScore) * 100)
                : null
              const scoreColor =
                pct == null ? "text-gray-500"
                : pct >= 70 ? "text-green-600"
                : pct >= 50 ? "text-yellow-600"
                : "text-red-600"
              const isExpanded = expandedId === sub.id
              const date = new Date(sub.submittedAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })
              const attemptNum = pastSubmissions.length - i

              return (
                <div key={sub.id} className="border rounded-lg bg-background overflow-hidden">
                  {/* Row header — click to expand */}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Attempt {attemptNum}
                      </span>
                      <span className="text-xs text-muted-foreground">{date}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(sub.timeSpentSec)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {pct != null && (
                        <span className={`text-sm font-bold ${scoreColor}`}>
                          {sub.totalScore}/{sub.maxScore} pts ({pct}%)
                        </span>
                      )}
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      }
                    </div>
                  </button>

                  {/* Expanded grading details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t bg-muted/30 space-y-4">
                      {/* Written answer */}
                      <div className="pt-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Your answer
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap bg-background border rounded p-3">
                          {sub.answerText}
                        </p>
                      </div>
                      {/* Grading result */}
                      {sub.gradingResult != null && (
                        <GradingResult
                          result={sub.gradingResult as GradingResultType}
                          maxScore={frq.totalPoints}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* used only to trigger grading flow */}
      <span data-submission-id={submissionId ?? ""} className="hidden" />
    </div>
  )
}
