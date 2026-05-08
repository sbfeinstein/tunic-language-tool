<script setup>
import { computed, reactive, useId, watch } from 'vue'
import { RUNE_INNER_EDGES, RUNE_OUTER_EDGES } from '@/constants/runes.js'

const props = defineProps({
  inputRune: {
    type: Object,
    required: false,
    default: null,
  },
})

watch(
  () => props.inputRune,
  (newInputRune) => {
    if (props.inputRune.type === 'outer') {
      activateLines(RUNE_OUTER_EDGES, false)
    } else {
      activateLines(RUNE_INNER_EDGES, false)
    }

    activateLines(Array.from(newInputRune.edges), true)
  },
  {
    deep: true,
  },
)

const activateLines = (lineIDs, active) => {
  for (const lineID of lineIDs) {
    const existingLine = linesMap.get(lineID)
    if (existingLine) {
      existingLine.active = active
    }
  }
}

const toggleLine = (lineID) => {
  const existingLine = linesMap.get(lineID)
  if (existingLine) {
    existingLine.active = !existingLine.active
  }
}

/**
 * All possible lines in a Rune shape, including outer and inner runes.
 */
const LINES = [
  { id: '1', x1: '40', y1: '0', x2: '80', y2: '40' },
  { id: '2', x1: '80', y1: '40', x2: '80', y2: '120' },
  { id: '3', x1: '40', y1: '160', x2: '80', y2: '120' },
  { id: '4', x1: '0', y1: '120', x2: '40', y2: '160' },
  { id: '5', x1: '0', y1: '40', x2: '0', y2: '120' },
  { id: '6', x1: '0', y1: '40', x2: '40', y2: '0' },
  { id: '7', x1: '40', y1: '0', x2: '40', y2: '80' },
  { id: '8', x1: '40', y1: '80', x2: '80', y2: '40' },
  { id: '9', x1: '40', y1: '80', x2: '80', y2: '120' },
  { id: '10', x1: '40', y1: '80', x2: '40', y2: '160' },
  { id: '11', x1: '0', y1: '120', x2: '40', y2: '80' },
  { id: '12', x1: '0', y1: '40', x2: '40', y2: '80' },
]

const baseId = useId()
const linesMap = reactive(
  new Map(LINES.map((line) => [line.id, { ...line, key: baseId + '-' + line.id, active: false }])),
)

const runeLines = computed(() => {
  const active = [...linesMap.values()].filter((line) => {
    return line.active
  })
  const inactive = [...linesMap.values()].filter((line) => {
    return !line.active
  })

  return {
    active: active,
    inactive: inactive,
  }
})
</script>

<template>
  <div class="editor-grid">
    <div class="editor">
      <svg viewBox="0 0 85 165">
        <g class="inactive">
          <line
            v-for="line in runeLines.inactive"
            :x1="line.x1"
            :x2="line.x2"
            :y1="line.y1"
            :y2="line.y2"
            :key="line.key"
            @click="toggleLine(line.id)"
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
            @click="toggleLine(line.id)"
          ></line>
        </g>
      </svg>
    </div>
    <div style="width: 150px">FOO</div>
    <div style="width: 150px">BAR</div>
  </div>
</template>

<style scoped>
.editor-grid {
  align-self: self-start;
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: minmax(250px, 1fr) auto auto;
  height: 100%;
  justify-self: start;
  padding: var(--spacing-sm);
  width: 100%;
}

.editor {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-sm) 4px;
  overflow: hidden;
}

.editor svg {
  display: block;
  inline-size: auto;
  block-size: auto;
  max-inline-size: 100%;
  max-block-size: 100%;
  overflow: visible;
  padding: 20px 50px 10px 50px;
  box-shadow: 0 0 10px 5px var(--color-shadow-subtle);
  background-color: var(--color-card-neutral);
}

.editor svg g {
  stroke-width: 6px;
  stroke-linecap: round;
  cursor: pointer;
}

.editor svg g.active {
  stroke: var(--color-outer-inner-active);
}

.editor svg g.active *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-active), var(--tlt-c-white) 60%);
}

.editor svg g.inactive {
  stroke: var(--color-outer-inner-inactive);
}

.editor svg g.inactive *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-inactive), var(--tlt-c-black) 60%);
}
</style>
