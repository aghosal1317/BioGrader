import { z } from "zod"

export const categoryScoreSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  pointsEarned: z.number().int().min(0),
  pointsAvailable: z.number().int().min(1),
  feedback: z.string(),
})

export const gradingResultSchema = z.object({
  totalScore: z.number().int().min(0),
  maxScore: z.number().int().min(1),
  percentage: z.number().min(0).max(100),
  categoryScores: z.array(categoryScoreSchema),
  overallFeedback: z.string(),
  missingConcepts: z.array(z.string()),
  exampleAnswer: z.string(),
  gradedAt: z.string(),
  modelUsed: z.string(),
})

export type GradingResultParsed = z.infer<typeof gradingResultSchema>
