import { RubricCategory } from "@/types/rubric"

export function buildGradingPrompt(
  frqPrompt: string,
  rubric: RubricCategory[],
  studentAnswer: string,
  totalPoints: number
): string {
  const rubricText = rubric
    .map(
      (cat, i) =>
        `### Criterion ${i + 1}: ${cat.name}\n` +
        `**Worth: ${cat.points} point${cat.points !== 1 ? "s" : ""} total**\n` +
        `Full credit requires: ${cat.description}\n` +
        (cat.keywords.length > 0 ? `Key concepts to look for: ${cat.keywords.join(", ")}\n` : "") +
        `Scoring: award ${cat.points}/${cat.points} if fully satisfied, partial credit (e.g. ${Math.ceil(cat.points / 2)}/${cat.points}) if partially satisfied, 0/${cat.points} if not addressed.`
    )
    .join("\n\n")

  return `You are an expert AP Biology teacher grading a student's Free Response Question (FRQ).

## CRITICAL SCORING RULES — read carefully before grading:

1. **Each criterion has a fixed point value shown as "Worth: N points total."**
   - If the student FULLY satisfies a criterion, award ALL N points (e.g. 3/3, not 1/3).
   - If the student PARTIALLY satisfies it, award a proportional amount (e.g. 1/3 or 2/3).
   - If the student does NOT address it, award 0.
2. **Never award more points than a criterion is worth.**
3. **Your \`pointsEarned\` number MUST match your written feedback.**
   - If your feedback says "full credit" or "excellent" or "correctly identified all requirements," \`pointsEarned\` MUST equal \`pointsAvailable\`.
   - If your feedback says "partial credit" or "missing X," \`pointsEarned\` must be less than \`pointsAvailable\`.
4. Return EXACTLY ${rubric.length} categoryScores entries — one per criterion, in order.

## FRQ Prompt
${frqPrompt}

## Rubric (Total: ${totalPoints} points across ${rubric.length} criteria)
${rubricText}

## Student's Answer
${studentAnswer || "(No answer provided)"}

## Grading Instructions
- Grade each criterion based ONLY on what the student wrote.
- Be specific — quote or reference the student's exact words in feedback.
- \`exampleAnswer\` should be a model full-credit response.
- \`missingConcepts\` should list specific biology terms/ideas the student omitted.
- Be encouraging but accurate about what was missing.`
}
