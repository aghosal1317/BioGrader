import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FRQImportForm } from "@/components/admin/FRQImportForm"
import { MCQImportForm } from "@/components/admin/MCQImportForm"
import { BookOpen, Brain, ExternalLink } from "lucide-react"

export default async function AdminImportPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const topics = await prisma.topic.findMany({ orderBy: { apUnit: "asc" } })

  const [frqCount, mcqCount] = await Promise.all([
    prisma.fRQ.count(),
    prisma.mCQ.count(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Questions</h1>
        <p className="text-gray-500 mt-1">
          Add FRQs and MCQs to the question library. Currently{" "}
          <strong>{frqCount} FRQs</strong> and <strong>{mcqCount} MCQs</strong> in the database.
        </p>
      </div>

      {/* Official sources callout */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-green-800">Where to find official AP Biology questions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-700 space-y-1.5">
          <a
            href="https://apstudents.collegeboard.org/courses/ap-biology/free-response-questions-by-year"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:underline font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            FRQs: College Board — AP Biology Free-Response Questions by Year (free PDF)
          </a>
          <a
            href="https://apcentral.collegeboard.org/media/pdf/ap-biology-course-and-exam-description.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:underline font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            MCQs: AP Biology Course &amp; Exam Description (CED) — includes ~20 official sample MCQs
          </a>
          <p className="text-xs text-green-600 pt-1">
            When adding official content, cite it as: <em>&ldquo;AP® Biology Free-Response Questions © [Year] College Board. All Rights Reserved.&rdquo;</em>
          </p>
        </CardContent>
      </Card>

      {/* Import tabs */}
      <Tabs defaultValue="frq">
        <TabsList className="w-full">
          <TabsTrigger value="frq" className="flex-1 gap-2">
            <BookOpen className="w-4 h-4" /> Add FRQ
          </TabsTrigger>
          <TabsTrigger value="mcq" className="flex-1 gap-2">
            <Brain className="w-4 h-4" /> Add MCQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add a Free-Response Question</CardTitle>
              <CardDescription>
                Paste the question text and build the rubric so the AI can grade responses accurately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FRQImportForm topics={topics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mcq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Multiple Choice Questions</CardTitle>
              <CardDescription>
                Add one question at a time or import a whole set at once using a CSV file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MCQImportForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
