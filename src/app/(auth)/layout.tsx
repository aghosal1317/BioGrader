import Link from "next/link"
import { Dna } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-green-700 dark:text-green-400 mb-8"
      >
        <Dna className="w-6 h-6" />
        BioGrader
      </Link>
      {children}
    </div>
  )
}
