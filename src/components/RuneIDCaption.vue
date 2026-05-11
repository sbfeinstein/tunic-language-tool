<script setup>
import { computed } from 'vue'

const props = defineProps({
  forceType: {
    type: String,
    required: false,
  },
  forceText: {
    type: String,
    required: false,
  },
  rune: {
    type: Object,
    required: false,
  },
})

const captionClass = computed(() => {
  if (props.forceType) {
    return `caption ${props.forceType}`
  } else if (props.rune) {
    return `caption ${props.rune.type}`
  } else {
    return 'caption'
  }
})

const captionText = computed(() => {
  if (props.forceText) {
    return props.forceText
  } else if (props.rune) {
    return props.rune.id
  } else {
    return null
  }
})
</script>

<template>
  <span :class="captionClass">{{ captionText }}</span>
</template>

<style scoped>
span.caption {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  width: auto;
  height: auto;

  color: var(--color-caption);
  padding: 2px 4px;
  font-family: monospace;
  font-size: 1em;
  border-radius: 4px;
}

span.caption.outer {
  background-color: var(--color-outer-rune-line-inactive);
}

span.caption.inner {
  background-color: var(--color-inner-rune-line-inactive);
}
</style>
