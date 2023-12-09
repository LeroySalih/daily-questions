'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useState} from 'react';
import Placeholder from '@tiptap/extension-placeholder'

const Tiptap = ({onChange, description, ref, name}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Enter Your Question …',
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
    ],
    content: description,
    onUpdate: ({editor}) => {
        // const json = editor.getText();
        // setData(json);
    },
    onBlur: ({editor, event}) => {
        const text = editor.getText();
        onChange && onChange(text)
    }
  })

  return (
    <EditorContent editor={editor} />
    
  )
}

export default Tiptap