<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  rune: {
    type: Object,
    required: true,
  },
})

const baseId = useId()

/**
 * All possible lines in a Rune shape, including outer and inner runes.
 */
const possible_lines = [
  { id: 1, key: baseId + '-E1', x1: '40', y1: '0', x2: '80', y2: '40' },
  { id: 2, key: baseId + '-E2', x1: '80', y1: '40', x2: '80', y2: '120' },
  { id: 3, key: baseId + '-E3', x1: '40', y1: '160', x2: '80', y2: '120' },
  { id: 4, key: baseId + '-E4', x1: '0', y1: '120', x2: '40', y2: '160' },
  { id: 5, key: baseId + '-E5', x1: '0', y1: '40', x2: '0', y2: '120' },
  { id: 6, key: baseId + '-E6', x1: '0', y1: '40', x2: '40', y2: '0' },
  { id: 7, key: baseId + '-E7', x1: '40', y1: '0', x2: '40', y2: '80' },
  { id: 8, key: baseId + '-E8', x1: '40', y1: '80', x2: '80', y2: '40' },
  { id: 9, key: baseId + '-E9', x1: '40', y1: '80', x2: '80', y2: '120' },
  { id: 10, key: baseId + '-E10', x1: '40', y1: '80', x2: '40', y2: '160' },
  { id: 11, key: baseId + '-E11', x1: '0', y1: '120', x2: '40', y2: '80' },
  { id: 12, key: baseId + '-E12', x1: '0', y1: '40', x2: '40', y2: '80' },
]

const rune_lines = computed(() => {
  return {
    active: possible_lines.filter((line) => {
      return props.rune.edges.has(line.id)
    }),
    inactive: possible_lines.filter((line) => {
      return !props.rune.edges.has(line.id)
    }),
  }
})
</script>

<template>
  <div :class="'card ' + props.rune.type">
    <svg viewBox="0 0 85 165">
      <g class="inactive">
        <line
          v-for="line in rune_lines.inactive"
          :x1="line.x1"
          :x2="line.x2"
          :y1="line.y1"
          :y2="line.y2"
          :key="line.key"
        ></line>
      </g>
      <g class="active">
        <line
          v-for="line in rune_lines.active"
          :x1="line.x1"
          :x2="line.x2"
          :y1="line.y1"
          :y2="line.y2"
          :key="line.key"
        ></line>
      </g>
    </svg>
    <div class="caption">{{ props.rune.id }}</div>
  </div>
</template>

<style>
/* Card - General Styling
   ========================================================================== */

.card {
  z-index: 1;
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

.card svg {
  z-index: 3;
  display: block;
  inline-size: auto;
  block-size: auto;
  max-inline-size: 100%;
  max-block-size: 100%;
  overflow: visible;
}

.card svg g {
  stroke-width: 6px;
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

/* Card - Caption Styling
   ========================================================================== */

.caption {
  z-index: 2;
  position: absolute;
  top: 7px;
  left: 7px;
  color: white;
  padding: 2px 4px;
  font-size: 11pt;
  border-radius: 4px;
}

.outer .caption {
  background-color: var(--color-outer-runes-inactive);
}

.inner .caption {
  background-color: var(--color-inner-runes-inactive);
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
