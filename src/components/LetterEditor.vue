<script setup>
import { computed, reactive, ref, useId, watch, watchEffect } from 'vue'
import { RUNE_INNER_EDGES, RUNE_OUTER_EDGES } from '@/constants/runes.js'
import ClearIcon from './icons/IconClear.vue'
import SelectedRuneStatus from '@/components/SelectedRuneStatus.vue'

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
  circleActive.value = false
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

const outerStatusRef = ref()
const innerStatusRef = ref()
const validationMessage = computed(() => {
  const outerStatus = outerStatusRef.value
  const innerStatus = innerStatusRef.value

  if (!outerStatus || !innerStatus) {
    return
  }

  if (outerStatus.state === 'invalid' && innerStatus.state === 'invalid') {
    return 'Inner and outer runes must be valid or empty'
  }

  if (outerStatus.state === 'invalid') {
    return 'Outer rune must be valid or empty'
  }

  if (innerStatus.state === 'invalid') {
    return 'Inner rune must be valid or empty'
  }

  if (circleActive.value && outerStatus.state === 'empty' && innerStatus.state === 'empty') {
    return 'Circle requires valid, non-empty inner and outer runes'
  }

  if (circleActive.value && outerStatus.state === 'empty') {
    return 'Circle requires a valid, non-empty outer rune'
  }

  if (circleActive.value && innerStatus.state === 'empty') {
    return 'Circle requires a valid, non-empty inner rune'
  }

  return null
})

const circleActive = ref(false)
const toggleCircle = () => (circleActive.value = !circleActive.value)
const outerStatusFirst = computed(() => circleActive.value)
</script>

<template>
  <div class="outer-panel">
    <div class="editor">
      <div class="rune-container">
        <i><ClearIcon @click="clearLines()" /></i>
        <svg id="rune" viewBox="0 0 85 180">
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
            <circle v-show="!circleActive" cx="40" cy="160" r="12" @click="toggleCircle()" />
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
            <circle v-show="circleActive" cx="40" cy="160" r="12" @click="toggleCircle()" />
          </g>
        </svg>
      </div>
    </div>
    <div class="controls">
      <div class="rune-analysis">
        <div>
          <SelectedRuneStatus
            v-if="outerStatusFirst"
            :lines-map="linesMap"
            rune-type="outer"
            @status-updated="(status) => (outerStatusRef = status)"
          />
          <SelectedRuneStatus
            v-else
            :lines-map="linesMap"
            rune-type="inner"
            @status-updated="(status) => (innerStatusRef = status)"
          />
        </div>
        <span class="operator">+</span>
        <div>
          <SelectedRuneStatus
            v-if="outerStatusFirst"
            :lines-map="linesMap"
            rune-type="inner"
            @status-updated="(status) => (innerStatusRef = status)"
          />
          <SelectedRuneStatus
            v-else
            :lines-map="linesMap"
            rune-type="outer"
            @status-updated="(status) => (outerStatusRef = status)"
          />
        </div>
      </div>
      <div v-show="validationMessage" class="validation">{{ validationMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
.outer-panel {
  align-self: self-start;
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  justify-self: start;
  padding: var(--spacing-sm);
  width: 100%;
  height: 100%;
}

.editor {
  min-width: 300px;
  padding: var(--spacing-md) var(--spacing-sm) 4px;
  box-shadow: 0 0 10px 2px var(--color-shadow-subtle);
  background-color: var(--color-card-neutral);
  margin-top: 5px;
  margin-bottom: 5px;
}

.rune-container {
  position: relative;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.rune-container svg#rune {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  overflow: visible;
  padding: 1em;
}

.rune-container svg#rune g {
  stroke-width: 8px;
  stroke-linecap: round;
  cursor: pointer;
  filter: var(--filter-drop-shadow-above);
}

.rune-container svg#rune g.active {
  stroke: var(--color-outer-inner-active);
  fill: var(--color-card-neutral);
}

.rune-container svg#rune g.active *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-active), var(--tlt-c-white) 60%);
}

.rune-container svg#rune g.inactive {
  stroke: var(--color-outer-inner-inactive);
  fill: transparent;
}

.rune-container svg#rune g.inactive *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-inactive), var(--tlt-c-black) 60%);
}

i {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 5px;
  right: 5px;
  stroke: var(--tlt-c-gray);
  fill: transparent;
  stroke-width: 4px;
  filter: var(--filter-drop-shadow-above);
}

i *:hover {
  stroke: color-mix(in srgb, var(--color-outer-inner-inactive), var(--tlt-c-black) 60%);
  cursor: pointer;
}

.controls {
  padding: var(--spacing-md) var(--spacing-sm) 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls .rune-analysis {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.controls .rune-analysis .operator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 200%;
  font-weight: bold;
}

.controls .validation {
  padding-top: 1em;
  color: var(--color-caption);
}
</style>
