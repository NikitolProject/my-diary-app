'use client'

import { EditorContent, Editor } from '@tiptap/react'

interface TiptapProps {
    editor: Editor,
} 

export const Tiptap = ({ editor }: TiptapProps) => {  
  return (
    <EditorContent editor={editor} />
  )
}
