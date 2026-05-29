<script setup>
import VerticalSplitter from '@/components/VerticalSplitter.vue'
import HorizontalSplitter from '@/components/HorizontalSplitter.vue'
import RuneKeyboard from '@/components/RuneKeyboard.vue'
import LetterEditor from '@/components/LetterEditor.vue'
import { ref } from 'vue'
import DocumentEditor from '@/components/DocumentEditor.vue'

const letterEditorRef = ref(null)

const handleSelectedRune = (rune) => {
  letterEditorRef.value?.handleSelectedRune(rune)
}
</script>

<template>
  <VerticalSplitter left-initial-width="50%">
    <template #left>
      <HorizontalSplitter top-initial-height="65%">
        <template #top><RuneKeyboard @runeSelected="handleSelectedRune" /></template>
        <template #bottom><LetterEditor ref="letterEditorRef" /></template>
      </HorizontalSplitter>
    </template>
    <template #right><DocumentEditor class="editor" /></template>
  </VerticalSplitter>
</template>

<style scoped>
.editor {
  height: 100vh;
}
</style>
