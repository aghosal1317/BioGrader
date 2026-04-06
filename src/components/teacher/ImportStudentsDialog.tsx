"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Upload, CheckCircle2, AlertCircle, FileText, Printer, Download } from "lucide-react"

interface ImportResult {
  created: number
  skipped: number
  errors: string[]
  credentials: { name: string; email: string; temporaryPassword: string }[]
}

export function ImportStudentsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { toast.error("Please select a CSV file"); return }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/teacher/import", { method: "POST", body: formData })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      toast.error(data.error ?? "Import failed")
      return
    }

    setResult(data)
    toast.success(`${data.created} student${data.created !== 1 ? "s" : ""} imported!`)
    router.refresh()
  }

  function handlePrint() {
    if (!result) return
    const appUrl = window.location.origin
    const rows = result.credentials
      .map(
        (c) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${c.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${c.email}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;">${c.temporaryPassword}</td>
          </tr>`
      )
      .join("")

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BioGrader — Student Login Credentials</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
          h1 { color: #16a34a; margin-bottom: 4px; }
          p { color: #6b7280; margin-bottom: 24px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 8px 12px; background: #f0fdf4; color: #15803d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
          .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
        </style>
      </head>
      <body>
        <h1>BioGrader — Student Login Credentials</h1>
        <p>
          Login at: <strong>${appUrl}/login</strong><br/>
          Students must change their password on first login.
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Temporary Password</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">
          Generated on ${new Date().toLocaleDateString()} · Keep this sheet confidential
        </div>
      </body>
      </html>
    `
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.print()
  }

  function handleDownloadCSV() {
    if (!result) return
    const appUrl = window.location.origin
    const rows = [
      ["Name", "Email", "Temporary Password", "Login URL"],
      ...result.credentials.map((c) => [c.name, c.email, c.temporaryPassword, `${appUrl}/login`]),
    ]
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student-credentials.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClose() {
    setOpen(false)
    setResult(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="w-4 h-4 mr-2" />
          Import students (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Students from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV with columns:{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">name</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">email</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">password</code>
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <>
            <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 border">
              <p className="text-gray-400 mb-1"># Example CSV format:</p>
              <p>name,email,password</p>
              <p>Jane Smith,jane@school.edu,BioClass2025</p>
              <p>John Doe,john@school.edu,BioClass2025</p>
            </div>
            <p className="text-xs text-gray-500">
              Students will be prompted to change their password on first login.
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                <FileText className="w-7 h-7 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Click to select CSV file</span>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" />
              </label>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Importing..." : "Import"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                {result.created} student{result.created !== 1 ? "s" : ""} created successfully
              </span>
            </div>
            {result.skipped > 0 && (
              <div className="flex items-start gap-2 text-yellow-700 bg-yellow-50 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">{result.skipped} row{result.skipped !== 1 ? "s" : ""} skipped</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs mt-0.5 text-yellow-600">{e}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Credential sheet preview */}
            {result.credentials.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Student Login Credentials — distribute to your class
                </p>
                <div className="border rounded-lg overflow-hidden max-h-52 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-green-50 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 text-green-700 font-semibold">Name</th>
                        <th className="text-left px-3 py-2 text-green-700 font-semibold">Email</th>
                        <th className="text-left px-3 py-2 text-green-700 font-semibold">Temp Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.credentials.map((c, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2 text-gray-700">{c.name}</td>
                          <td className="px-3 py-2 text-gray-500">{c.email}</td>
                          <td className="px-3 py-2 font-mono text-gray-700">{c.temporaryPassword}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Login URL: <span className="font-medium">{typeof window !== "undefined" ? window.location.origin : ""}/login</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
                <Printer className="w-4 h-4 mr-1.5" />
                Print sheet
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="flex-1">
                <Download className="w-4 h-4 mr-1.5" />
                Download CSV
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
