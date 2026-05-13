<script setup>
import RuneIDCaption from '@/components/RuneIDCaption.vue'
import { computed, watchEffect } from 'vue'
import { EDGES_TO_RUNE_MAPS } from '@/constants/runes.js'
import runeUtils from '@/utils/runeUtils.js'

const props = defineProps({
  linesMap: {
    type: Map,
    required: true,
  },
  runeType: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['statusUpdated'])

const activeEdges = computed(() => {
  const active = [...props.linesMap.values()].filter((line) => {
    return line.active
  })

  return new Set(active.filter((line) => line.type === props.runeType).map((line) => line.id))
})
const emptyEdges = computed(() => activeEdges.value.size === 0)
const matchingRune = computed(() => {
  if (props.runeType === 'outer') {
    return EDGES_TO_RUNE_MAPS.outerEdges.get(runeUtils.keyForEdges(activeEdges.value))
  } else if (props.runeType === 'inner') {
    return EDGES_TO_RUNE_MAPS.innerEdges.get(runeUtils.keyForEdges(activeEdges.value))
  }
  return null
})

const validationMessage = computed(() => {
  if (emptyEdges.value || matchingRune.value) {
    return null
  }

  return `${props.runeType} rune must be valid or empty`
})

watchEffect(() => {
  emit('statusUpdated', {
    activeEdges,
    emptyEdges,
    matchingRune,
    validationMessage,
  })
})
</script>

<template>
  <RuneIDCaption v-if="emptyEdges" force-text="Empty" :force-type="runeType" />
  <RuneIDCaption v-else-if="matchingRune" :rune="matchingRune" />
  <RuneIDCaption v-else force-text="Invalid" :force-type="runeType" />
</template>

<style scoped>
/** Selects based off RunIDCaption internal styling */
.controls .caption {
  min-width: 5em;
  min-height: 4em;
  font-size: 150%;
}
</style>
