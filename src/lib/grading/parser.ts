import Anthropic from "@anthropic-ai/sdk"
import { gradingResultSchema, GradingResultParsed } from "./schema"
import { RubricCategory } from "@/types/rubric"

// The JSON schema passed to Claude as a tool — matches gradingResultSchema
export const gradingToolSchema: Anthropic.Tool = {
  name: "grade_submission",
  description: "Grade an AP Biology FRQ submission and return a structured result",
  input_schema: {
    type: "object" as const,
    required: [
      "totalScore",
      "maxScore",
      "percentage",
      "categoryScores",
      "overallFeedback",
      "missingConcepts",
      "exampleAnswer",
    ],
    properties: {
      totalScore: { type: "integer", description: "Total points earned" },
      maxScore: { type: "integer", description: "Maximum possible points" },
      percentage: { type: "number", description: "Score as percentage 0-100" },
      categoryScores: {
        type: "array",
        items: {
          type: "object",
          required: [
            "categoryId",
            "categoryName",
            "pointsEarned",
            "pointsAvailable",
            "feedback",
          ],
          properties: {
            categoryId: { type: "string" },
            categoryName: { type: "string" },
            pointsEarned: { type: "integer" },
            pointsAvailable: { type: "integer" },
            feedback: { type: "string" },
          },
        },
      },
      overallFeedback: {
        type: "string",
        description: "2-3 sentence overall feedback for the student",
      },
      missingConcepts: {
        type: "array",
        items: { type: "string" },
        description: "List of key biology concepts the student missed",
      },
      exampleAnswer: {
        type: "string",
        description: "A model full-credit answer",
      },
    },
  },
}

export function parseGradingResponse(
  response: Anthropic.Message,
  rubric: RubricCategory[],
  totalPoints: number
): GradingResultParsed {
  const toolUse = response.content.find((b) => b.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not use the grading tool")
  }

  const raw = toolUse.input as Record<string, unknown>
  raw.gradedAt = new Date().toISOString()
  raw.modelUsed = "claude-sonnet-4-5"

  // Normalise categoryScores against the authoritative rubric.
  // Claude may return more or fewer items than the rubric — always use
  // exactly rubric.length items, with pointsAvailable forced from the rubric.
  if (Array.isArray(raw.categoryScores)) {
    raw.categoryScores = rubric.map((rubricItem, i) => {
      const cs = (raw.categoryScores as Record<string, unknown>[])[i] ?? {}
      let earned = typeof cs.pointsEarned === "number" ? cs.pointsEarned : 0

      // Safeguard: if Claude's own feedback says full credit was earned but
      // pointsEarned < pointsAvailable, trust the feedback and award full credit.
      const feedback = typeof cs.feedback === "string" ? cs.feedback.toLowerCase() : ""
      const fullCreditPhrases = [
        "full credit", "earns full", "earned full", "full marks",
        "excellent work", "outstanding", "correctly identified all",
        "all requirements", "complete answer", "fully satisfied",
      ]
      const claimsFullCredit = fullCreditPhrases.some((p) => feedback.includes(p))
      if (claimsFullCredit && earned < rubricItem.points) {
        earned = rubricItem.points
      }

      return {
        ...cs,
        categoryId: rubricItem.id,
        categoryName: rubricItem.name,
        // pointsAvailable is always the rubric value — never Claude's guess
        pointsAvailable: rubricItem.points,
        // clamp earned to the rubric max so a hallucinated "2/1" can't happen
        pointsEarned: Math.min(Math.max(0, earned), rubricItem.points),
      }
    })
  }

  // Derive totalScore and maxScore from the normalised categoryScores.
  // This is the single source of truth — ignore whatever totals Claude reported.
  const categories = raw.categoryScores as { pointsEarned: number; pointsAvailable: number }[]
  raw.maxScore  = categories.reduce((sum, c) => sum + c.pointsAvailable, 0)
  raw.totalScore = categories.reduce((sum, c) => sum + c.pointsEarned,   0)
  raw.percentage = (raw.maxScore as number) > 0
    ? Math.round(((raw.totalScore as number) / (raw.maxScore as number)) * 100)
    : 0

  return gradingResultSchema.parse(raw)
}
