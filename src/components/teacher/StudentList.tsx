"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Star, Trash2, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Student {
  id: string
  name: string | null
  email: string
  mustChangePassword: boolean
  createdAt: Date | string
  userStats: { totalSubmissions: number } | null
  submissions: { totalScore: number | null; maxScore: number | null }[]
}

interface Props {
  initialStudents: Student[]
}

export function StudentList({ initialStudents }: Props) {
  const router = useRouter()
  const [students, setStudents] = useState(initialStudents)
  const [toDelete, setToDelete] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)

    const res = await fetch(`/api/teacher/students/${toDelete.id}`, { method: "DELETE" })
    setDeleting(false)

    if (!res.ok) {
      toast.error("Failed to remove student")
      return
    }

    setStudents((prev) => prev.filter((s) => s.id !== toDelete.id))
    toast.success(`${toDelete.name} has been removed`)
    setToDelete(null)
    router.refresh()
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No students yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload a CSV file to add students to your class.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-1">
        {students.map((student) => {
          const avgScore =
            student.submissions.length > 0
              ? Math.round(
                  student.submissions.reduce(
                    (sum, s) =>
                      sum + (s.totalScore && s.maxScore ? (s.totalScore / s.maxScore) * 100 : 0),
                    0
                  ) / student.submissions.length
                )
              : null

          return (
            <div
              key={student.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {/* Clickable info area */}
              <Link href={`/teacher/students/${student.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-900">{student.name}</p>
                  {student.mustChangePassword && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">
                      Needs password change
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {student.email} · Added {formatDate(student.createdAt)}
                </p>
              </Link>

              {/* Stats + delete */}
              <div className="flex items-center gap-4 text-sm text-gray-500 ml-4 shrink-0">
                <span>{student.userStats?.totalSubmissions ?? 0} FRQs</span>
                {avgScore != null && (
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <Star className="w-3.5 h-3.5" />
                    {avgScore}% avg
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    setToDelete(student)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm delete dialog */}
      <Dialog open={!!toDelete} onOpenChange={(v) => { if (!v) setToDelete(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove student?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{toDelete?.name}</strong> ({toDelete?.email}) and all
              of their submissions and progress data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Remove student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
