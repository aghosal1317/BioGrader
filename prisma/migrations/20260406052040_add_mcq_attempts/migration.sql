-- CreateTable
CREATE TABLE "mcq_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mcqId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "unit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mcq_attempts_userId_idx" ON "mcq_attempts"("userId");

-- CreateIndex
CREATE INDEX "mcq_attempts_userId_unit_idx" ON "mcq_attempts"("userId", "unit");

-- AddForeignKey
ALTER TABLE "mcq_attempts" ADD CONSTRAINT "mcq_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_attempts" ADD CONSTRAINT "mcq_attempts_mcqId_fkey" FOREIGN KEY ("mcqId") REFERENCES "mcqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
