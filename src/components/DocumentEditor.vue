<script setup>
import { EditorContent } from '@tiptap/vue-3'
import { useDocumentStore } from '@/stores/documentStore.js'
import { computed } from 'vue'
import DocumentMenubar from '@/components/DocumentMenubar.vue'

const docStore = useDocumentStore()
const editor = computed(() => docStore.editor)
</script>

<template>
  <div class="editor-wrapper">
    <DocumentMenubar />
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
