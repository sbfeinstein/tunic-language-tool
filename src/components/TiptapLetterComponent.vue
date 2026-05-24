<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import LetterImage from '@/components/LetterImage.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <node-view-wrapper class="rune-letter">
    <LetterImage :letterID="props.node.attrs.letterID" />
  </node-view-wrapper>
</template>

<style scoped>
:deep(div.rune-letter) {
  display: inline-block;
}
</style>
