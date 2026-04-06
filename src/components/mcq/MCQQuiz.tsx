"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ChevronLeft,
} from "lucide-react"

interface MCQQuestion {
  id: string
  question: string
  options: { A: string; B: string; C: string; D: string }
  answer: string
  explanation: string
  difficulty: string
  year: number | null
}

interface Props {
  unitNum: number
  unitName: string
  questions: MCQQuestion[]
}

type AnswerState = "unanswered" | "correct" | "incorrect"

export function MCQQuiz({ unitNum, unitName, questions }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState<AnswerState>("unanswered")
  const [scores, setScores] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  const q = questions[current]
  const progress = ((current) / questions.length) * 100
  const correctCount = scores.filter(Boolean).length

  const handleSelect = useCallback(
    (letter: string) => {
      if (answered !== "unanswered") return
      setSelected(letter)
      const isCorrect = letter === q.answer
      setAnswered(isCorrect ? "correct" : "incorrect")
      setScores((prev) => [...prev, isCorrect])

      // Persist attempt (fire-and-forget)
      fetch("/api/mcq/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqId: q.id, answer: letter, correct: isCorrect, unit: unitNum }),
      }).catch(() => {/* silent — don't block the quiz UI */})
    },
    [answered, q.answer, q.id, unitNum]
  )

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered("unanswered")
    }
  }, [current, questions.length])

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered("unanswered")
    setScores([])
    setDone(false)
  }

  // Results screen
  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100)
    const grade =
      pct >= 80 ? { label: "Excellent!", color: "text-green-600", bg: "bg-green-50" }
      : pct >= 60 ? { label: "Good job!", color: "text-yellow-600", bg: "bg-yellow-50" }
      : { label: "Keep practicing!", color: "text-red-600", bg: "bg-red-50" }

    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className={`rounded-2xl p-8 text-center ${grade.bg} mb-6`}>
          <Trophy className={`w-14 h-14 mx-auto mb-3 ${grade.color}`} />
          <p className={`text-4xl font-extrabold mb-1 ${grade.color}`}>{pct}%</p>
          <p className="text-lg font-semibold text-gray-800">{grade.label}</p>
          <p className="text-sm text-gray-500 mt-1">
            {correctCount} / {questions.length} correct · Unit {unitNum}: {unitName}
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="space-y-2 mb-6">
          {scores.map((correct, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {correct
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span className="text-gray-600 line-clamp-1">Q{i + 1}: {questions[i].question}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700" asChild>
            <Link href="/mcq">
              <ChevronLeft className="w-4 h-4 mr-1" />
              All units
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mcq">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Units
          </Link>
        </Button>
        <div className="text-center">
          <p className="text-xs text-gray-500">Unit {unitNum}: {unitName}</p>
          <p className="text-sm font-semibold text-gray-700">
            {current + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="font-medium text-green-600">{correctCount}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{current}</span>
        </div>
      </div>

      <Progress value={progress} className="h-1.5 mb-6" />

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={cn(
            "border-0 text-xs",
            q.difficulty === "EASY" ? "bg-green-100 text-green-700"
            : q.difficulty === "HARD" ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
          )}>
            {q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()}
          </Badge>
          {q.year && (
            <Badge variant="outline" className="text-xs">{q.year} AP Exam</Badge>
          )}
        </div>
        <p className="text-gray-900 text-base leading-relaxed font-medium">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {(["A", "B", "C", "D"] as const).map((letter) => {
          const isSelected = selected === letter
          const isCorrect = letter === q.answer
          const showResult = answered !== "unanswered"

          let style = "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50"
          if (showResult) {
            if (isCorrect) style = "border-green-500 bg-green-50 text-green-800"
            else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50 text-red-800"
            else style = "border-gray-200 bg-white opacity-60"
          } else if (isSelected) {
            style = "border-green-500 bg-green-50"
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={answered !== "unanswered"}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3",
                style,
                answered === "unanswered" && "cursor-pointer"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                showResult && isCorrect ? "border-green-500 bg-green-500 text-white"
                : showResult && isSelected && !isCorrect ? "border-red-400 bg-red-400 text-white"
                : "border-gray-300 text-gray-500"
              )}>
                {letter}
              </span>
              <span className="text-sm leading-snug">{q.options[letter]}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 ml-auto mt-0.5" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered !== "unanswered" && (
        <div className={cn(
          "rounded-xl p-4 mb-6 border",
          answered === "correct"
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-2 mb-1">
            {answered === "correct"
              ? <CheckCircle2 className="w-4 h-4 text-green-600" />
              : <XCircle className="w-4 h-4 text-red-500" />}
            <span className={cn(
              "text-sm font-semibold",
              answered === "correct" ? "text-green-700" : "text-red-700"
            )}>
              {answered === "correct" ? "Correct!" : `Incorrect — Answer: ${q.answer}`}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={answered !== "unanswered" ? handleNext : undefined}
        disabled={answered === "unanswered"}
      >
        {current + 1 >= questions.length ? "See results" : "Next question"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
