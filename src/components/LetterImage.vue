<script setup>
import { ref, watch } from 'vue'
import { LETTER_SVG_VITE_MODULES } from '@/constants/letters.js'

const props = defineProps({
  letterID: {
    type: String,
    required: true,
  },
})

const htmlForSVG = ref(null)
watch(
  () => props.letterID,
  async (newLetterID) => {
    if (!newLetterID) {
      return
    }

    const path = `/src/assets/letters/unstyled/${newLetterID}.svg`
    if (!LETTER_SVG_VITE_MODULES[path]) {
      console.warn(`SVG not found: ${path}`)
      return
    }
    htmlForSVG.value = await LETTER_SVG_VITE_MODULES[path]()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="letter-image-container" v-html="htmlForSVG" />
</template>

<style scoped>
.letter-image-container {
  display: inline-block;
  position: relative;
  align-items: center;
  justify-content: center;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.letter-image-container :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  overflow: visible;

  stroke: var(--color-outer-inner-active);
  stroke-width: 10px;
  stroke-linecap: round;
}
</style>
