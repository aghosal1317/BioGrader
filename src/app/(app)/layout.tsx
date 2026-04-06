import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  // Force students with temp passwords to change before doing anything
  if (session.user.mustChangePassword) {
    redirect("/change-password")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1">{children}</main>
        <footer className="text-center py-3 text-xs text-gray-400 border-t border-gray-200">
          Made by Aneesh Ghosal
        </footer>
      </div>
    </div>
  )
}
