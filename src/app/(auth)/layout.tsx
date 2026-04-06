import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-green-700 mb-8"
      >
        <Image src="/bio-grader-logo.png" alt="BioGrader logo" width={36} height={36} />
        BioGrader
      </Link>
      {children}
    </div>
  )
}
