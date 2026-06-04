import { defineStore } from 'pinia'
import { useEditor } from '@tiptap/vue-3'
import DEFAULT_DOCUMENT from '@/assets/defaultDocument.json'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'
import TiptapLetterExtension from '@/components/TiptapLetterExtension.js'
import TiptapRuneWordExtension from '@/components/TiptapRuneWordExtension.js'
import { ref } from 'vue'

export const useDocumentStore = defineStore('document', () => {
  const editor = useEditor({
    content: DEFAULT_DOCUMENT,
    extensions: [
      Document,
      Paragraph,
      Text,
      UndoRedo,
      TiptapLetterExtension,
      TiptapRuneWordExtension,
    ],
    onBeforeCreate({ _editor }) {
      isDirty.value = false
    },
    onUpdate({ _editor }) {
      isDirty.value = true
    },
  })

  const isDirty = ref(false)

  const currentFilename = ref(null)
  const fileHandle = ref(null)

  const newDocument = () => {
    fileHandle.value = null
    loadContent(DEFAULT_DOCUMENT)
  }

  const loadContentFromFileSystem = async (handle) => {
    const file = await handle.getFile()
    const json = JSON.parse(await file.text())
    fileHandle.value = handle
    loadContent(json, file.name)
  }

  const loadContent = (content, filename) => {
    if (!editor) return
    currentFilename.value = filename
    editor.value.commands.setContent(content, { emitUpdate: false })
    isDirty.value = false
  }

  const contentAsJSON = () => JSON.stringify(editor.value.getJSON())

  const saveContent = async (newFileHandle) => {
    if (!editor) {
      return
    }
    if (newFileHandle) {
      fileHandle.value = newFileHandle
      currentFilename.value = fileHandle.value.name
    }
    if (!fileHandle.value) {
      return
    }

    const writable = await fileHandle.value.createWritable()
    await writable.write(contentAsJSON())
    await writable.close()
    isDirty.value = false
  }

  return {
    editor,
    isDirty,
    currentFilename,
    fileHandle,
    newDocument,
    loadContentFromFileSystem,
    loadContent,
    saveContent,
    contentAsJSON,
  }
})
