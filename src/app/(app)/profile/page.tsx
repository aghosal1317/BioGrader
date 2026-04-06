import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileForm } from "./ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true, email: true, role: true,
      grade: true, subjectInterests: true,
      school: true, county: true, state: true,
      schoolType: true, classSection: true,
      schoolYear: true, apExamYear: true, timezone: true,
    },
  })

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
