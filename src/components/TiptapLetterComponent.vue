<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import LetterImage from '@/components/LetterImage.vue'
import { computed } from 'vue'

const props = defineProps(nodeViewProps)

const cursorPosition = computed(() => {
  const { from, to } = props.editor.state.selection
  const nodeStart = props.getPos()

  // Only show cursor for single position (not a selection)
  if (from !== to) return null

  // Cursor before this node (left edge)
  if (from === nodeStart) return 'left'

  // Cursor after this node (right edge) - atomic nodes take 1 position
  if (from === nodeStart + 1) return 'right'

  return null
})

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
    <span v-if="cursorPosition === 'left'" class="cursor-indicator cursor-left"></span>
    <span v-if="cursorPosition === 'right'" class="cursor-indicator cursor-right"></span>
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

.cursor-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: black;
  animation: blink 1s infinite;
}

.cursor-left {
  left: 0;
}

.cursor-right {
  right: 0;
}

@keyframes blink {
  0%,
  49%,
  100% {
    opacity: 1;
  }
  50%,
  99% {
    opacity: 0;
  }
}

.ProseMirror-selectednode {
  background-color: rgba(0, 123, 255, 0.3);
  outline: none;
}
</style>
