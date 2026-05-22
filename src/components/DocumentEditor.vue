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
</script>

<template>
  <editor-content :editor="editor" />
</template>

<style scoped>
:deep(.tiptap) {
  padding: 5px;
}

:deep(.tiptap p) {
  font-size: 22pt;
}
</style>
