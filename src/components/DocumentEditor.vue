<script setup>
import { EditorContent } from '@tiptap/vue-3'
import { useDocumentStore } from '@/stores/documentStore.js'
import { computed } from 'vue'

const docStore = useDocumentStore()
const editor = computed(() => docStore.editor)

const exportDocument = () => {
  const content = JSON.stringify(editor.value.getJSON())

  const filename = 'tunic-language-tool.json'
  const element = document.createElement('a')
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}
</script>

<template>
  <div class="editor-wrapper">
    <div class="menubar">
      <input type="button" value="export" @click="exportDocument()" />
    </div>
    <div class="editor-area">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.menubar {
  padding: 5px;
  flex-shrink: 0; /* Prevent shrinking below content size */
}

.editor-area {
  flex: 1; /* Take all remaining space */
  min-height: 0; /* Critical: allows flex child to shrink below content size */
  overflow: hidden;
}

:deep(.editor-area > div) {
  height: 100%;
  flex: 1;
}

:deep(.tiptap.ProseMirror) {
  height: 100%;
  padding: 5px;
  overflow: auto;
  font-size: 22pt;
}

:deep(.rune-letter) {
  width: 1.5em;
  display:inline-block;
  vertical-align: middle;
  padding:0;
}
</style>
