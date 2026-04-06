-- CreateTable
CREATE TABLE "mcqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "unit" INTEGER NOT NULL,
    "topicSlug" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mcqs_unit_idx" ON "mcqs"("unit");

-- CreateIndex
CREATE INDEX "mcqs_topicSlug_idx" ON "mcqs"("topicSlug");
