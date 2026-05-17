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

const translationData = computed(() => {
  if (
    (props.position === 'first' && !editorStore.circleActive) ||
    (props.position === 'second' && editorStore.circleActive)
  ) {
    return translationStore.inner[editorStore.innerRuneMatch?.id]?.translation
  }
  return translationStore.outer[editorStore.outerRuneMatch?.id]?.translation
})

const translationText = computed(() =>
  translationData.value ? translationData.value?.join('<br>') || '??' : '',
)

const translationCSSClass = computed(() => (translationData.value?.length > 0 ? '' : '-unknown'))
</script>

<template>
  <span v-html="translationText" :class="translationCSSClass" />
</template>

<style scoped>
.-unknown {
  color: var(--tlt-c-gray);
}
</style>
