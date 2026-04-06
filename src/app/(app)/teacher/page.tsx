import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportStudentsDialog } from "@/components/teacher/ImportStudentsDialog"
import { StudentList } from "@/components/teacher/StudentList"
import { Users, BookOpen, AlertTriangle } from "lucide-react"

export default async function TeacherPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "TEACHER") redirect("/dashboard")

  const students = await prisma.user.findMany({
    where: { teacherId: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      mustChangePassword: true,
      createdAt: true,
      userStats: { select: { totalSubmissions: true } },
      submissions: {
        where: { status: "GRADED" },
        select: { totalScore: true, maxScore: true },
      },
    },
    orderBy: { name: "asc" },
  })

  const totalSubmissions = students.reduce(
    (sum, s) => sum + (s.userStats?.totalSubmissions ?? 0), 0
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500">Manage your students and view their progress</p>
        </div>
        <ImportStudentsDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: <Users className="w-5 h-5 text-green-600" />, label: "Students", value: students.length },
          { icon: <BookOpen className="w-5 h-5 text-blue-500" />, label: "Total Submissions", value: totalSubmissions },
          {
            icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
            label: "Awaiting Password Change",
            value: students.filter(s => s.mustChangePassword).length,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center gap-2">
                {stat.icon}
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Students</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentList initialStudents={students} />
        </CardContent>
      </Card>
    </div>
  )
}
