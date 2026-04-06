export interface CategoryScore {
  categoryId: string
  categoryName: string
  pointsEarned: number
  pointsAvailable: number
  feedback: string
}

export interface GradingResult {
  totalScore: number
  maxScore: number
  percentage: number
  categoryScores: CategoryScore[]
  overallFeedback: string
  missingConcepts: string[]
  exampleAnswer: string
  gradedAt: string
  modelUsed: string
}
