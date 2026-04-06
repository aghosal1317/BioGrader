"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, School, MapPin, BookOpen, Calendar } from "lucide-react"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC",
]

const SCHOOL_YEAR_OPTIONS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"]
const AP_EXAM_YEARS = [2025, 2026, 2027, 2028]

interface UserProfile {
  name: string | null
  email: string
  role: string
  grade: number | null
  subjectInterests: string[]
  school: string | null
  county: string | null
  state: string | null
  schoolType: string | null
  classSection: string | null
  schoolYear: string | null
  apExamYear: number | null
  timezone: string | null
}

interface Props {
  user: UserProfile | null
}

const NONE = "__none__"

export function ProfileForm({ user }: Props) {
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN"

  const [name,         setName]         = useState(user?.name ?? "")
  const [grade,        setGrade]        = useState(user?.grade ? String(user.grade) : "")
  const [school,       setSchool]       = useState(user?.school ?? "")
  const [county,       setCounty]       = useState(user?.county ?? "")
  const [state,        setState]        = useState(user?.state ?? "")
  const [schoolType,   setSchoolType]   = useState(user?.schoolType ?? "")
  const [classSection, setClassSection] = useState(user?.classSection ?? "")
  const [schoolYear,   setSchoolYear]   = useState(user?.schoolYear ?? "")
  const [apExamYear,   setApExamYear]   = useState(user?.apExamYear ? String(user.apExamYear) : "")
  const [loading,      setLoading]      = useState(false)

  async function handleSave() {
    setLoading(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:         name || undefined,
        grade:        grade ? parseInt(grade) : null,
        school:       school || null,
        county:       county || null,
        state:        state || null,
        schoolType:   schoolType || null,
        classSection: classSection || null,
        schoolYear:   schoolYear || null,
        apExamYear:   apExamYear ? parseInt(apExamYear) : null,
      }),
    })
    setLoading(false)
    if (res.ok) toast.success("Settings saved")
    else toast.error("Failed to save — please try again")
  }

  return (
    <div className="space-y-6">

      {/* ── Personal info ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled className="bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400">Email cannot be changed here.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {!isTeacher && (
            <div className="space-y-1.5">
              <Label>Grade Level</Label>
              <Select value={grade || NONE} onValueChange={(v) => setGrade(v === NONE ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Not specified —</SelectItem>
                  <SelectItem value="9">9th Grade</SelectItem>
                  <SelectItem value="10">10th Grade</SelectItem>
                  <SelectItem value="11">11th Grade</SelectItem>
                  <SelectItem value="12">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── School info ────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="school">School Name</Label>
            <Input
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Lincoln High School"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="county">County / District</Label>
              <Input
                id="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Wake County"
              />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Select value={state || NONE} onValueChange={(v) => setState(v === NONE ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Not specified —</SelectItem>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>School Type</Label>
            <Select value={schoolType || NONE} onValueChange={(v) => setSchoolType(v === NONE ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Select school type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— Not specified —</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="charter">Charter</SelectItem>
                <SelectItem value="homeschool">Homeschool</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Class info ────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            AP Biology Class
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="classSection">Class Period / Section</Label>
              <Input
                id="classSection"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                placeholder="e.g. Period 3 or Block B"
              />
            </div>
            <div className="space-y-1.5">
              <Label>School Year</Label>
              <Select value={schoolYear || NONE} onValueChange={(v) => setSchoolYear(v === NONE ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Not specified —</SelectItem>
                  {SCHOOL_YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isTeacher && (
            <div className="space-y-1.5">
              <Label>AP Exam Year</Label>
              <Select value={apExamYear || NONE} onValueChange={(v) => setApExamYear(v === NONE ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="When are you taking the AP exam?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Not specified —</SelectItem>
                  {AP_EXAM_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Helps track your preparation timeline.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleSave}
        disabled={loading || !name.trim()}
      >
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}
