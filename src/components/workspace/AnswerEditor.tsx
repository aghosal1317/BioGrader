"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnswerEditorProps {
  initialContent?: Record<string, unknown> | null
  onChange: (content: Record<string, unknown>) => void
  onActivity: () => void
  disabled?: boolean
}

export function AnswerEditor({
  initialContent,
  onChange,
  onActivity,
  disabled,
}: AnswerEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your answer here. Be thorough — address each part of the question.",
      }),
    ],
    content: initialContent ?? "",
    editable: !disabled,
    onUpdate({ editor }) {
      onActivity()
      onChange(editor.getJSON() as Record<string, unknown>)
    },
  })

  if (!editor) return null

  return (
    <div className={cn("border rounded-lg overflow-hidden", disabled && "opacity-60")}>
      <div className="flex items-center gap-1 px-3 py-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-7 w-7 p-0", editor.isActive("bold") && "bg-gray-200")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-7 w-7 p-0", editor.isActive("italic") && "bg-gray-200")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-7 w-7 p-0", editor.isActive("bulletList") && "bg-gray-200")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-7 w-7 p-0", editor.isActive("orderedList") && "bg-gray-200")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[300px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  )
}
