<script setup>
import { computed, ref, watch } from 'vue'
import { useDocumentStore } from '@/stores/documentStore.js'
import DEFAULT_DOCUMENT from '@/assets/defaultDocument.json'

const docStore = useDocumentStore()

const DEFAULT_FILENAME = 'tunic-language-tool.json'

// File System Access API picker filter (Chromium). Ignored by the fallback path.
const FILE_PICKER_TYPES = [
  {
    description: 'Tunic Language Tool document',
    accept: { 'application/json': ['.json'] },
  },
]

const supportsFileSystemAccess = () =>
  typeof window !== 'undefined' && 'showSaveFilePicker' in window

// Whether the document has unsaved edits since the last new/open/save.
const isDirty = ref(false)
// Name of the current file, or null when the document is not bound to one.
const currentFileName = ref(null)
// Handle to the file the document is bound to (File System Access API only).
let fileHandle = null

// Mark the document dirty on every edit. The editor ref is populated
// asynchronously, so attach (and clean up) the listener via a watcher. Initial
// content goes through onCreate rather than onUpdate, so it starts clean.
watch(
  () => docStore.editor,
  (editor, _previous, onCleanup) => {
    if (!editor) return
    const onUpdate = () => {
      isDirty.value = true
    }
    editor.on('update', onUpdate)
    onCleanup(() => editor.off('update', onUpdate))
  },
  { immediate: true },
)

const fileLabel = computed(() => {
  const name = currentFileName.value ?? '<not saved>'
  return isDirty.value ? `${name} (modified)` : name
})

/** Replace the document contents without marking it dirty. */
const loadContent = (content, fileName = null) => {
  if (!docStore.editor) return
  docStore.editor.commands.setContent(content, { emitUpdate: false })
  currentFileName.value = fileName
  isDirty.value = false
}

/** Returns true if it is safe to discard the current document. */
const confirmDiscard = () =>
  !isDirty.value || window.confirm('You have unsaved changes. Discard them?')

const newDocument = () => {
  if (!confirmDiscard()) return
  fileHandle = null
  loadContent(DEFAULT_DOCUMENT)
}

const openViaFilePicker = async () => {
  let handle
  try {
    ;[handle] = await window.showOpenFilePicker({ types: FILE_PICKER_TYPES, multiple: false })
  } catch (error) {
    if (error.name === 'AbortError') return // user cancelled the dialog
    throw error
  }
  const file = await handle.getFile()
  const json = JSON.parse(await file.text())
  fileHandle = handle
  loadContent(json, file.name)
}

const openViaInput = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json,.json'
  input.style.display = 'none'
  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    document.body.removeChild(input)
    if (!file) return
    try {
      const json = JSON.parse(await file.text())
      fileHandle = null
      loadContent(json, file.name)
    } catch {
      window.alert('Could not open file: it is not a valid document.')
    }
  })
  document.body.appendChild(input)
  input.click()
}

const openDocument = async () => {
  if (!confirmDiscard()) return
  try {
    if (supportsFileSystemAccess()) {
      await openViaFilePicker()
    } else {
      openViaInput()
    }
  } catch {
    window.alert('Could not open file: it is not a valid document.')
  }
}

const downloadDocument = (content, fileName) => {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const saveDocument = async () => {
  if (!docStore.editor) return
  const content = JSON.stringify(docStore.editor.getJSON(), null, 2)

  if (supportsFileSystemAccess()) {
    try {
      // No bound file yet (fresh / "new" document) → prompt for a destination.
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: currentFileName.value || DEFAULT_FILENAME,
          types: FILE_PICKER_TYPES,
        })
      }
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
      currentFileName.value = fileHandle.name
      isDirty.value = false
    } catch (error) {
      if (error.name === 'AbortError') return // user cancelled; keep dirty state
      window.alert('Could not save file.')
    }
  } else {
    const fileName = currentFileName.value || DEFAULT_FILENAME
    downloadDocument(content, fileName)
    currentFileName.value = fileName
    isDirty.value = false
  }
}
</script>

<template>
  <div class="menubar">
    <input type="button" value="new" @click="newDocument()" />
    <input type="button" value="open" @click="openDocument()" />
    <input type="button" value="save" @click="saveDocument()" />
    <span class="filename">{{ fileLabel }}</span>
  </div>
</template>

<style scoped>
.menubar {
  padding: 5px;
  flex-shrink: 0; /* Prevent shrinking below content size */
}

.filename {
  margin-left: 10px;
}
</style>
