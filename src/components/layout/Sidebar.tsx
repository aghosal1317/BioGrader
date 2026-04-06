"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Dna,
  LogOut,
  Users,
  Brain,
  PlusCircle,
  Sun,
  Moon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "FRQs", icon: BookOpen },
  { href: "/mcq", label: "MCQ Practice", icon: Brain },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Settings", icon: Settings },
]

const teacherNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher", label: "My Students", icon: Users },
  { href: "/library", label: "FRQ Library", icon: BookOpen },
  { href: "/mcq", label: "MCQ Practice", icon: Brain },
  { href: "/admin", label: "Import Questions", icon: PlusCircle },
  { href: "/profile", label: "Settings", icon: Settings },
]

interface SidebarProps {
  role?: string
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { resolvedTheme, setTheme } = useTheme()

  const navItems = role === "TEACHER" ? teacherNavItems : studentNavItems

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-gray-950 text-white border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Dna className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-white">BioGrader</span>
      </div>

      {/* Role badge */}
      {role === "TEACHER" && (
        <div className="px-4 pt-3">
          <Badge className="bg-green-600/20 text-green-400 border border-green-600/30 text-xs">
            Teacher
          </Badge>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="bg-green-600 text-white text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-white hover:bg-gray-800"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark"
            ? <><Sun className="w-4 h-4 mr-2" />Light mode</>
            : <><Moon className="w-4 h-4 mr-2" />Dark mode</>
          }
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-red-400 hover:bg-gray-800"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
