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
    <div className="flex min-h-screen bg-background">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1">{children}</main>
        <footer className="text-center py-3 text-xs text-muted-foreground border-t border-border space-y-0.5">
          <p>Made by Aneesh Ghosal</p>
          <p className="text-[10px] opacity-60">
            AP® Biology Free-Response Questions © College Board. All rights reserved.
            AP® is a registered trademark of College Board. BioGrader is not affiliated with or endorsed by College Board.
            Content used for educational purposes only.
          </p>
        </footer>
      </div>
    </div>
  )
}
