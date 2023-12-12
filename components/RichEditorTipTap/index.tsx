'use client'

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import styles from "./index.module.css";

export type TipTapParams = {
  description: string,
  onChange: (text: string)=> void
}

const Tiptap = ({onChange, description}:TipTapParams) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Enter Your Question …',
        
      }),
    ],
    content: description,
    
    onBlur: ({editor, event}) => {
        const text = editor.getText();
        onChange && onChange(text)
    }
  })

  return (
    <EditorContent editor={editor} className={styles.editor} />
    
  )
}

export default Tiptap