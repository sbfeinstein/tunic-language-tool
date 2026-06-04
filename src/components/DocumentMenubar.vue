<script setup>
import { computed } from 'vue'
import { useDocumentStore } from '@/stores/documentStore.js'
import { DEFAULT_FILENAME, FILE_PICKER_TYPES } from '@/constants/documents.js'
import { supportsFileSystemAccess } from '@/utils/systemUtils.js'

const docStore = useDocumentStore()

const fileLabel = computed(() => {
  const name = docStore.currentFilename ?? '<not saved>'
  return docStore.isDirty ? `${name} (modified)` : name
})

const confirmDiscard = () =>
  !docStore.isDirty || window.confirm('You have unsaved changes. Discard them?')

const newDocument = () => {
  if (!confirmDiscard()) return
  docStore.ops.new()
}

const openViaFilePicker = async () => {
  let handle
  try {
    ;[handle] = await window.showOpenFilePicker({
      types: FILE_PICKER_TYPES,
      multiple: false,
    })
  } catch (error) {
    if (error.name === 'AbortError') return // user canceled the dialog
    throw error
  }
  await docStore.ops.loadFromFileSystem(handle)
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
      docStore.ops.load(json, file.name)
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

  if (!supportsFileSystemAccess()) {
    const fileName = docStore.currentFilename || DEFAULT_FILENAME
    downloadDocument(docStore.contentAsJSON(), fileName)
    docStore.isDirty = false
    return
  }

  try {
    let fileHandle = docStore.fileHandle
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: docStore.currentFilename || DEFAULT_FILENAME,
        types: FILE_PICKER_TYPES,
      })
    }
    await docStore.ops.save(fileHandle)
  } catch (error) {
    if (error.name === 'AbortError') return // user canceled; keep dirty state
    window.alert('Could not save file.')
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
