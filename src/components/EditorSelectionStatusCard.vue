<script setup>
import RuneIDCaption from '@/components/RuneIDCaption.vue'
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editorStore.js'

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
})

const editorStore = useEditorStore()

const cardState = computed(() => {
  if (
    (props.position === 'first' && !editorStore.circleActive) ||
    (props.position === 'second' && editorStore.circleActive)
  ) {
    return {
      isEmpty: editorStore.innerRuneEmpty,
      match: editorStore.innerRuneMatch,
      isInvalid: editorStore.innerRuneInvalid,
      runeType: 'inner',
    }
  }
  return {
    isEmpty: editorStore.outerRuneEmpty,
    match: editorStore.outerRuneMatch,
    isInvalid: editorStore.outerRuneInvalid,
    runeType: 'outer',
  }
})
</script>

<template>
  <RuneIDCaption v-if="cardState.isEmpty" force-text="Empty" :force-type="cardState.runeType" />
  <RuneIDCaption v-if="cardState.match" :rune="cardState.match" />
  <RuneIDCaption v-if="cardState.isInvalid" force-text="Invalid" :force-type="cardState.runeType" />
</template>

<style scoped>
/** Selects based off RunIDCaption internal styling */
.controls .caption {
  min-width: 5em;
  min-height: 4em;
  font-size: 150%;
}
</style>
