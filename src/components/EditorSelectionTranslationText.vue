<script setup>
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editorStore.js'
import { useRuneTranslationStore } from '@/stores/runeTranslationStore.js'

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
})

const editorStore = useEditorStore()
const translationStore = useRuneTranslationStore()

const cardState = computed(() => {
  if (
    (props.position === 'first' && !editorStore.circleActive) ||
    (props.position === 'second' && editorStore.circleActive)
  ) {
    return {
      cssClass: '',
      text:
        translationStore.inner[editorStore.innerRuneMatch?.id]?.translation.join('<br>') || '??',
    }
  }
  return {
    cssClass: '',
    text: translationStore.outer[editorStore.outerRuneMatch?.id]?.translation.join('<br>') || '??',
  }
})
</script>

<template>
  <span v-html="cardState.text" />
</template>

<style scoped></style>
