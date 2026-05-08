<script setup>
import { computed, reactive, useId, watch } from 'vue'
import { EDGES_TO_RUNE_MAPS, RUNE_INNER_EDGES, RUNE_OUTER_EDGES } from '@/constants/runes.js'
import ClearIcon from './icons/IconClear.vue'
import runeUtils from '@/utils/runeUtils.js'

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

const clearLines = () => {
  for (const value of linesMap.values()) {
    value.active = false
  }
}

/**
 * All possible lines in a Rune shape, including outer and inner runes.
 */
const LINES = [
  { id: '1', x1: '40', y1: '0', x2: '80', y2: '40', type: 'outer' },
  { id: '2', x1: '80', y1: '40', x2: '80', y2: '120', type: 'outer' },
  { id: '3', x1: '40', y1: '160', x2: '80', y2: '120', type: 'outer' },
  { id: '4', x1: '0', y1: '120', x2: '40', y2: '160', type: 'outer' },
  { id: '5', x1: '0', y1: '40', x2: '0', y2: '120', type: 'outer' },
  { id: '6', x1: '0', y1: '40', x2: '40', y2: '0', type: 'outer' },
  { id: '7', x1: '40', y1: '0', x2: '40', y2: '80', type: 'inner' },
  { id: '8', x1: '40', y1: '80', x2: '80', y2: '40', type: 'inner' },
  { id: '9', x1: '40', y1: '80', x2: '80', y2: '120', type: 'inner' },
  { id: '10', x1: '40', y1: '80', x2: '40', y2: '160', type: 'inner' },
  { id: '11', x1: '0', y1: '120', x2: '40', y2: '80', type: 'inner' },
  { id: '12', x1: '0', y1: '40', x2: '40', y2: '80', type: 'inner' },
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

const matchingOuterRune = computed(() => {
  const activeOuterEdges = new Set(
    runeLines.value.active.filter((line) => line.type === 'outer').map((line) => line.id),
  )
  return EDGES_TO_RUNE_MAPS.outerEdges.get(runeUtils.keyForEdges(activeOuterEdges))
})

const matchingInnerRune = computed(() => {
  const activeInnerEdges = new Set(
    runeLines.value.active.filter((line) => line.type === 'inner').map((line) => line.id),
  )
  return EDGES_TO_RUNE_MAPS.innerEdges.get(runeUtils.keyForEdges(activeInnerEdges))
})
</script>

<template>
  <div class="editor-grid">
    <div class="editor">
      <div class="rune-container">
        <i><ClearIcon @click="clearLines()" /></i>
        <svg id="rune" viewBox="0 0 85 165">
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
    </div>
    <div style="width: 150px">
      {{ matchingOuterRune ? 'outer-' + matchingOuterRune.id : 'No Match' }}
    </div>
    <div style="width: 150px">
      {{ matchingInnerRune ? 'inner-' + matchingInnerRune.id : 'No Match' }}
    </div>
  </div>
</template>

<style scoped>
.editor-grid {
  align-self: self-start;
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: minmax(280px, 2fr) 1fr 1fr;
  height: 100%;
  justify-self: start;
  padding: var(--spacing-sm);
  width: 100%;
}

.editor {
  height: 100%;
  min-height: 0; /* This is the "magic" line for grid/flex items */
  display: flex;
  flex-direction: column;
}

.rune-container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-sm) 4px;

  /* Add these */
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.rune-container svg#rune {
  display: block;
  /* Change these four lines */
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;

  /* Keep your other styles */
  overflow: visible;
  padding: 20px 50px 10px 50px;
  box-shadow: 0 0 10px 5px var(--color-shadow-subtle);
  background-color: var(--color-card-neutral);
}

.rune-container svg#rune g {
  stroke-width: 8px;
  stroke-linecap: round;
  cursor: pointer;
}

.rune-container svg#rune g {
  filter: drop-shadow(3px 2px 1px var(--color-shadow-active));
}

.rune-container svg#rune g.active {
  stroke: var(--color-outer-inner-active);
}

.rune-container svg#rune g.active *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-active), var(--tlt-c-white) 60%);
}

.rune-container svg#rune g.inactive {
  stroke: var(--color-outer-inner-inactive);
}

.rune-container svg#rune g.inactive *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-inactive), var(--tlt-c-black) 60%);
}

i {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 25px;
  right: 15px;
  padding: 2px 4px;
}
i svg {
  stroke: var(--tlt-c-gray);
  fill: transparent;
  stroke-width: 4px;
  filter: drop-shadow(3px 2px 1px var(--color-shadow-active));
}

i svg *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-inactive), var(--tlt-c-black) 60%);
  cursor: pointer;
}
</style>
