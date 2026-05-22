<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'

const editor = useEditor({
  content: '<p>But what does it all mean? 🎉</p>',
  extensions: [Document, Paragraph, Text, UndoRedo],
})

const exportDocument = () => {
  console.log('Export')
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
</style>
