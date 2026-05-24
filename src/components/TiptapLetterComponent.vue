<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import LetterImage from '@/components/LetterImage.vue'

const props = defineProps(nodeViewProps)

const handleClick = (event) => {
  event.preventDefault()
  event.stopPropagation()

  props.editor.chain().focus().setTextSelection(props.getPos()).run()
}
</script>

<template>
  <node-view-wrapper class="rune-letter" contenteditable="false" @click="handleClick">
    <LetterImage :letterID="props.node.attrs.letterID" />
    <span class="selection-helper">a</span>
  </node-view-wrapper>
</template>

<style scoped>
.rune-letter {
  display: inline-block;
  transition: background-color 0.1s ease;
  position: relative;
}

.selection-helper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: all;
  color: transparent;
  pointer-events: none;
  font-size: 1px;
  overflow: hidden;
  display: inline-block;
}

.ProseMirror-selectednode {
  background-color: rgba(0, 123, 255, 0.3);
  outline: none;
}
</style>
