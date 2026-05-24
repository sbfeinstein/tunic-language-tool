import { defineStore } from 'pinia'
import { useEditor } from '@tiptap/vue-3'
import DEFAULT_DOCUMENT from '@/assets/defaultDocument.json'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'
import VueComponent from '@/components/TiptapLetterExtension.js'
import RuneWord from '@/components/TiptapRuneWordExtension.js'

export const useDocumentStore = defineStore('document', () => {
  const editor = useEditor({
    content: DEFAULT_DOCUMENT,
    extensions: [Document, Paragraph, Text, UndoRedo, VueComponent, RuneWord],
  })

  return { editor }
})
