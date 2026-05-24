<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import LetterImage from '@/components/LetterImage.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <node-view-wrapper class="rune-letter" contenteditable="false">
    <LetterImage :letterID="props.node.attrs.letterID" />
  </node-view-wrapper>
</template>

<style scoped>
.rune-letter {
  display: inline-block;
  transition: background-color 0.1s ease;
}

.ProseMirror-selectednode {
  background-color: rgba(0, 123, 255, 0.3);
  outline: none;
}
</style>
