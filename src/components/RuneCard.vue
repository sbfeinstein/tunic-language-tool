<script setup>
import { computed, useId } from 'vue'
import RuneIDCaption from '@/components/RuneIDCaption.vue'
import { useRuneDataStore } from '@/stores/runeData.js'

const props = defineProps({
  rune: {
    type: Object,
    required: true,
  },
})

const store = useRuneDataStore()

/**
 * All possible lines in a Rune shape, including outer and inner runes.
 */
const baseId = useId()
const LINES = [
  { id: '1', key: baseId + '-E1', x1: '40', y1: '0', x2: '80', y2: '40' },
  { id: '2', key: baseId + '-E2', x1: '80', y1: '40', x2: '80', y2: '120' },
  { id: '3', key: baseId + '-E3', x1: '40', y1: '160', x2: '80', y2: '120' },
  { id: '4', key: baseId + '-E4', x1: '0', y1: '120', x2: '40', y2: '160' },
  { id: '5', key: baseId + '-E5', x1: '0', y1: '40', x2: '0', y2: '120' },
  { id: '6', key: baseId + '-E6', x1: '0', y1: '40', x2: '40', y2: '0' },
  { id: '7', key: baseId + '-E7', x1: '40', y1: '0', x2: '40', y2: '80' },
  { id: '8', key: baseId + '-E8', x1: '40', y1: '80', x2: '80', y2: '40' },
  { id: '9', key: baseId + '-E9', x1: '40', y1: '80', x2: '80', y2: '120' },
  { id: '10', key: baseId + '-E10', x1: '40', y1: '80', x2: '40', y2: '160' },
  { id: '11', key: baseId + '-E11', x1: '0', y1: '120', x2: '40', y2: '80' },
  { id: '12', key: baseId + '-E12', x1: '0', y1: '40', x2: '40', y2: '80' },
]

const runeLines = computed(() => {
  return {
    active: LINES.filter((line) => {
      return props.rune.edges.has(line.id)
    }),
    inactive: LINES.filter((line) => {
      return !props.rune.edges.has(line.id)
    }),
  }
})

const runeData = computed(() => {
  if (props.rune.type === 'outer') {
    return store.outer[props.rune.id]
  }

  if (props.rune.type === 'inner') {
    return store.inner[props.rune.id]
  }

  return null
})

const translation = computed(() => {
  return runeData.value.translation || '??'
})

const translationClass = computed(() => {
  let cls = 'translation'
  if (runeData.value.translation) {
    cls += ' known-translation'
  }
  if (runeData.value.emphasized) {
    cls += ' emphasized'
  }
  return cls
})
</script>

<template>
  <div :class="'card ' + rune.type">
    <RuneIDCaption :rune="rune" class="caption" />
    <svg viewBox="0 0 85 165">
      <g class="inactive">
        <line
          v-for="line in runeLines.inactive"
          :x1="line.x1"
          :x2="line.x2"
          :y1="line.y1"
          :y2="line.y2"
          :key="line.key"
        ></line>
      </g>
      <g class="active">
        <line
          v-for="line in runeLines.active"
          :x1="line.x1"
          :x2="line.x2"
          :y1="line.y1"
          :y2="line.y2"
          :key="line.key"
        ></line>
      </g>
    </svg>
    <span :class="translationClass">{{ translation }}</span>
  </div>
</template>

<style scoped>
/* Card - General Styling
   ========================================================================== */

.card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-sm) 4px;

  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  box-shadow: 4px 3px 5px var(--color-shadow-subtle);

  transition:
    transform var(--transition-speed),
    box-shadow var(--transition-speed),
    background-color var(--transition-speed);
  overflow: hidden;
}

.card:hover {
  cursor: pointer;
}

.card svg {
  display: block;
  inline-size: auto;
  block-size: auto;
  width: 100%;
  max-block-size: 100%;
  overflow: visible;
  padding-left: 1.5em;
}

.card svg g {
  stroke-width: 8px;
  stroke-linecap: round;
}

.card:hover {
  box-shadow: -4px 8px 5px var(--color-shadow-hover);
  transform: translateY(-5px) translateX(5px);
}

.card:active {
  box-shadow: 6px 4px 5px var(--color-shadow-active);
  transform: translateY(2px) translateX(-2px);
}

.caption {
  position: absolute;
  top: 7px;
  left: 7px;
}

.translation {
  padding-right: 1em;
  color: var(--tlt-c-gray);
}

.translation.emphasized {
  font-weight: bold;
}

.card.inner .known-translation {
  color: var(--color-inner-rune-line-active);
}

.card.outer .known-translation {
  color: var(--color-outer-rune-line-active);
}

/* Card - Outer Rune Styling
   ========================================================================== */

.card.outer {
  background-color: var(--color-outer-runes-inactive);
}

.card.outer svg g.active {
  stroke: var(--color-outer-rune-line-active);
}

.card.outer svg g.inactive {
  stroke: var(--color-outer-rune-line-inactive);
}

.card.outer:hover {
  background-color: var(--color-outer-runes-hover);
}

.card.outer:active {
  background-color: var(--color-outer-runes-active);
}

/* Card - Inner Rune Styling
   ========================================================================== */

.card.inner {
  background-color: var(--color-inner-runes-inactive);
}

.card.inner svg g.active {
  stroke: var(--color-inner-rune-line-active);
}

.card.inner svg g.inactive {
  stroke: var(--color-inner-rune-line-inactive);
}

.card.inner:hover {
  background-color: var(--color-inner-runes-hover);
}

.card.inner:active {
  background-color: var(--color-inner-runes-active);
}
</style>
