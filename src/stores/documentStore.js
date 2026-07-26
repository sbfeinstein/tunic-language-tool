import { defineStore } from 'pinia'
import { useEditor } from '@tiptap/vue-3'
import { ref } from 'vue'
import DEFAULT_DOCUMENT from '@/assets/defaultDocument.json'
import DEFAULT_RUNE_TRANSLATIONS from '@/assets/defaultRuneTranslations.json'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'
import TiptapLetterExtension from '@/components/TiptapLetterExtension.js'
import TiptapRuneWordExtension from '@/components/TiptapRuneWordExtension.js'
import { VERSIONS } from '@/constants/documents.js'
import { isObject } from '@/utils/jsonUtils.js'
import { useRuneTranslationStore } from '@/stores/runeTranslationStore.js'
import { DOC_SESSION_STORAGE_KEY, SESSION_STORAGE_DEBOUNCE_MS } from '@/constants/persistence.js'

export const useDocumentStore = defineStore('document', () => {
  const isDirty = ref(false)
  const currentFilename = ref(null)
  const fileHandle = ref(null)
  const translationsStore = useRuneTranslationStore()

  // Debounce timer for persistence
  let persistTimeout = null
  let isRestoring = false

  // Define contentAsJSON early so it can be used in other functions
  const contentAsJSON = () => {
    const outerRunes = Object.values(translationsStore.outer)
    const innerRunes = Object.values(translationsStore.inner)
    const content = {
      ...DEFAULT_DOCUMENT,
      document: editor.value.getJSON(),
      translations: {
        outerRunes,
        innerRunes,
      },
    }
    return JSON.stringify(content)
  }

  const persistToSessionStorage = () => {
    try {
      const data = {
        isDirty: isDirty.value,
        currentFilename: currentFilename.value,
        document: JSON.parse(contentAsJSON()),
      }
      sessionStorage.setItem(DOC_SESSION_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to persist state:', e)
    }
  }

  // Small performance optimization, debounce persisting the whole doc state to session storage
  const debouncedPersistToSessionStorage = () => {
    if (isRestoring) return
    if (persistTimeout) clearTimeout(persistTimeout)
    persistTimeout = setTimeout(() => {
      persistToSessionStorage()
    }, SESSION_STORAGE_DEBOUNCE_MS)
  }

  const editor = useEditor({
    content: DEFAULT_DOCUMENT.document,
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
      debouncedPersistToSessionStorage()
    },
  })

  const restoreFromSessionStorage = () => {
    const stored = sessionStorage.getItem(DOC_SESSION_STORAGE_KEY)
    if (!stored) {
      return
    }
    try {
      isRestoring = true
      const data = JSON.parse(stored)
      currentFilename.value = data.currentFilename
      isDirty.value = data.isDirty
      if (data.document) {
        loadContent(data.document, data.currentFilename, true)
      }
      isRestoring = false
    } catch (e) {
      console.error('Failed to restore persisted state:', e)
      isRestoring = false
    }
  }

  const newDocument = () => {
    fileHandle.value = null
    return loadContent({ ...DEFAULT_DOCUMENT, translations: DEFAULT_RUNE_TRANSLATIONS })
  }

  const loadFromFileSystem = async (handle) => {
    const file = await handle.getFile()
    fileHandle.value = handle
    const content = await file.text()
    return loadContent(content, file.name)
  }

  const loadContent = (content, filename, skipTranslationLoad = false) => {
    if (!editor) {
      return {
        loaded: false,
        message: 'Editor is not initialized',
      }
    }

    let json = content
    if (!isObject(json)) {
      try {
        json = JSON.parse(content)
      } catch (e) {
        return {
          loaded: false,
          message: 'Invalid file, not in Tunic Language Tool format',
        }
      }
    }

    if (!isObject(json)) {
      return {
        loaded: false,
        message: 'Invalid file, not in Tunic Language Tool format',
      }
    }

    const metadata = json.metadata

    if (
      !metadata ||
      !VERSIONS[metadata.version] ||
      metadata.type !== VERSIONS[metadata.version].type
    ) {
      return {
        loaded: false,
        message: 'Invalid file, not in Tunic Language Tool format',
      }
    }

    try {
      editor.value.commands.setContent(json.document, { emitUpdate: false })
      if (!skipTranslationLoad) {
        translationsStore.loadRuneTranslations(json.translations)
      }
    } catch (e) {
      return {
        loaded: false,
        message: 'Error loading file',
      }
    }

    currentFilename.value = filename
    isDirty.value = false

    return {
      loaded: true,
      message: null,
    }
  }

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
    const data = contentAsJSON()
    await writable.write(data)
    await writable.close()
    isDirty.value = false
  }

  return {
    editor,
    isDirty,
    currentFilename,
    fileHandle,
    contentAsJSON,
    ops: {
      new: newDocument,
      loadFromFileSystem,
      load: loadContent,
      save: saveContent,
    },
    restoreFromSessionStorage: restoreFromSessionStorage,
  }
})
