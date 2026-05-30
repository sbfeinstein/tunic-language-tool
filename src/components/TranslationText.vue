<script setup>
import { computed } from 'vue'
import { useRuneTranslationStore } from '@/stores/runeTranslationStore.js'
import RuneIDCaption from '@/components/RuneIDCaption.vue'

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
  outerRuneID: {
    type: String,
    default: '00',
  },
  innerRuneID: {
    type: String,
    default: '00',
  },
  circleActive: {
    type: Boolean,
    required: true,
  },
})

const translationStore = useRuneTranslationStore()

const translation = computed(() => {
  let type, store, runeID
  if (
    (props.position === 'first' && !props.circleActive) ||
    (props.position === 'second' && props.circleActive)
  ) {
    type = 'inner'
    store = translationStore.inner
    runeID = props.innerRuneID
  } else {
    type = 'outer'
    store = translationStore.outer
    runeID = props.outerRuneID
  }

  return {
    type,
    id: runeID,
    notEmpty: runeID !== '00',
    text: store[runeID]?.translation || '?',
    cssClass: store[runeID]?.translation ? 'tooltip' : 'tooltip -unknown',
  }
})
</script>

<template>
  <span v-show="translation.notEmpty" :class="translation.cssClass"
    ><span class="tooltiptext">
      <RuneIDCaption :force-text="translation.id" :force-type="translation.type" /></span
    >{{ translation.text }}</span
  >
</template>

<style scoped>
.-unknown {
  color: var(--tlt-c-gray);
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltiptext {
  text-align: center;
  position: absolute;
  z-index: 1;
  visibility: hidden;
  width: 130px;
  bottom: 100%;
  left: 65%;
  margin-left: -65px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
