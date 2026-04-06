import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dna, BookOpen, BarChart3, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-green-700">
          <Dna className="w-6 h-6" />
          BioGrader
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/register">Get started free</Link>
          </Button>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-powered AP Biology grading
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 max-w-2xl leading-tight">
          Master AP Biology FRQs with instant AI feedback
        </h1>
        <p className="text-xl text-gray-600 max-w-lg mb-8">
          Practice real College Board questions, get scored like the AP exam, and see exactly
          where you lost points — before test day.
        </p>
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6" asChild>
          <Link href="/register">Start practicing for free</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 pb-20">
        {[
          {
            icon: <BookOpen className="w-7 h-7 text-green-600" />,
            title: "Real AP Questions",
            desc: "Past College Board FRQs organized by year, topic, and difficulty.",
          },
          {
            icon: <Sparkles className="w-7 h-7 text-green-600" />,
            title: "AI Grading",
            desc: "Scores your answer using official rubrics and explains every point.",
          },
          {
            icon: <BarChart3 className="w-7 h-7 text-green-600" />,
            title: "Track Progress",
            desc: "See your improvement over time with detailed analytics and topic breakdowns.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
