<script setup>
import { computed, ref, watch } from 'vue'
import { INNER_LINE_IDS, LEGENDS, OUTER_LINE_IDS } from '@/constants/runes.js'
import ClearIcon from './icons/IconClear.vue'
import LegendIcon from '@/components/icons/IconLegend.vue'
import { useEditorStore } from '@/stores/editorStore.js'
import { useDocumentStore } from '@/stores/documentStore.js'
import EditorSelectionStatusCard from '@/components/EditorSelectionStatusCard.vue'
import EditorSelectionTranslationText from '@/components/EditorSelectionTranslationText.vue'
import LetterImage from '@/components/LetterImage.vue'

const props = defineProps({
  inputRune: {
    type: Object,
    required: false,
    default: null,
  },
})

const editorStore = useEditorStore()
const docStore = useDocumentStore()

const toggleCircle = () => (editorStore.dataRef.circle.active = !editorStore.dataRef.circle.active)
const showLegend = ref(false)

/**
 * Sets the rune lines with the given IDs to active and other outer rune lines to inactive, from
 * the lineIDsForType (which is intended to be OUTER_LINE_IDS or INNER_LINE_IDS)
 */
const activateLines = (allLineIDs, linesState, inputLineIDs) => {
  for (const id of allLineIDs) {
    linesState[id].active = false
  }
  for (const id of inputLineIDs) {
    linesState[id].active = true
  }
}

const toggleLine = (lineID) => {
  if (OUTER_LINE_IDS.includes(lineID)) {
    editorStore.dataRef.lines.outer[lineID].active = !editorStore.dataRef.lines.outer[lineID].active
  }
  if (INNER_LINE_IDS.includes(lineID)) {
    editorStore.dataRef.lines.inner[lineID].active = !editorStore.dataRef.lines.inner[lineID].active
  }
}

const clearLines = () => {
  Object.keys(editorStore.dataRef.lines.outer).forEach(
    (id) => (editorStore.dataRef.lines.outer[id].active = false),
  )
  Object.keys(editorStore.dataRef.lines.inner).forEach(
    (id) => (editorStore.dataRef.lines.inner[id].active = false),
  )
  editorStore.dataRef.circle.active = false
}

watch(
  () => props.inputRune,
  (inputRune) => {
    switch (props.inputRune.type) {
      case 'outer':
        activateLines(OUTER_LINE_IDS, editorStore.dataRef.lines.outer, inputRune.lines)
        break
      case 'inner':
        activateLines(INNER_LINE_IDS, editorStore.dataRef.lines.inner, inputRune.lines)
        break
    }
  },
  {
    deep: true,
  },
)

const insertRune = () => {
  if (!editorStore.letterID) return

  const { editor } = docStore
  const { state } = editor
  const { selection } = state
  const { $from } = selection

  // Check if we are already inside a runeWord
  // We look at the parent node of the current selection
  const isInRuneWord = $from.node($from.depth).type.name === 'runeWord'

  if (isInRuneWord) {
    editor.chain()
      .insertContent({
        type: 'runeLetter',
        attrs: {
          letterID: editorStore.letterID,
        },
      })
      .focus()
      .run()
  } else {
    editor.chain()
      .insertContent({
        type: 'runeWord',
        content: [
          {
            type: 'runeLetter',
            attrs: {
              letterID: editorStore.letterID,
            },
          },
        ],
      })
      .focus()
      .run()
  }
}

const validationMessage = computed(() => {
  if (editorStore.outerRuneInvalid && editorStore.innerRuneInvalid) {
    return 'Inner and outer runes must be valid or empty'
  }

  if (editorStore.outerRuneInvalid) {
    return 'Outer rune must be valid or empty'
  }

  if (editorStore.innerRuneInvalid) {
    return 'Inner rune must be valid or empty'
  }

  if (editorStore.circleActive && editorStore.outerRuneEmpty && editorStore.innerRuneEmpty) {
    return 'Circle requires valid, non-empty inner and outer runes'
  }

  if (editorStore.circleActive && editorStore.outerRuneEmpty) {
    return 'Circle requires a valid, non-empty outer rune'
  }

  if (editorStore.circleActive && editorStore.innerRuneEmpty) {
    return 'Circle requires a valid, non-empty inner rune'
  }

  return null
})
</script>

<template>
  <div class="outer-panel">
    <div class="editor">
      <div class="rune-container">
        <span class="letter-id" v-show="editorStore.letterID">{{ editorStore.letterID }}</span>
        <i class="clear-icon"><ClearIcon @click="clearLines()" /></i>
        <i class="legend-icon"><LegendIcon @click="showLegend = !showLegend" /></i>
        <svg id="rune" :viewBox="editorStore.dataRef.svgViewBox">
          <g class="inactive">
            <line
              v-for="line in editorStore.inactiveLines"
              :x1="line.x1"
              :x2="line.x2"
              :y1="line.y1"
              :y2="line.y2"
              :key="line.key"
              @click="toggleLine(line.id)"
            ></line>
            <circle
              v-show="!editorStore.circleActive"
              :cx="editorStore.dataRef.circle.cx"
              :cy="editorStore.dataRef.circle.cy"
              :r="editorStore.dataRef.circle.r"
              @click="toggleCircle()"
            />
          </g>
          <g class="active">
            <line
              v-for="line in editorStore.activeLines"
              :x1="line.x1"
              :x2="line.x2"
              :y1="line.y1"
              :y2="line.y2"
              :key="line.key"
              @click="toggleLine(line.id)"
            ></line>
            <circle
              v-show="editorStore.circleActive"
              :cx="editorStore.dataRef.circle.cx"
              :cy="editorStore.dataRef.circle.cy"
              :r="editorStore.dataRef.circle.r"
              @click="toggleCircle()"
            />
          </g>
          <text
            v-show="showLegend"
            v-for="legend in LEGENDS"
            :x="legend.x"
            :y="legend.y"
            :key="`legend-${legend.id}`"
            @click="toggleLine(legend.id)"
          >
            {{ legend.id }}
          </text>
        </svg>
      </div>
    </div>
    <div class="controls">
      <div class="rune-analysis">
        <EditorSelectionStatusCard position="first" />
        <span class="operator" v-show="editorStore.validForTranslation">+</span>
        <EditorSelectionStatusCard position="second" />
        <span class="operator" v-show="editorStore.validForTranslation">=</span>
        <div class="translation" v-show="editorStore.validForTranslation">
          <EditorSelectionTranslationText position="first" />
          <EditorSelectionTranslationText position="second" />
        </div>
      </div>
      <div v-show="validationMessage" class="validation">{{ validationMessage }}</div>
      <LetterImage v-show="editorStore.letterID" :letterID="editorStore.letterID || ''" />
      <input type="button" v-show="editorStore.letterID" value="insert" @click="insertRune" />
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

.rune-container svg text {
  fill: rgb(from var(--tlt-c-gray) r g b / 80%);
  stroke: rgb(from var(--tlt-c-black) r g b / 80%);
  stroke-width: 0.02em;
  font-size: 10pt;
  font-family: monospace;
  cursor: pointer;
  user-select: none;
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

.clear-icon {
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

.legend-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50px;
  right: 0;
  stroke: var(--tlt-c-gray);
  fill: transparent;
  stroke-width: 2px;
  filter: var(--filter-drop-shadow-above);
}

.clear-icon *:hover,
.legend-icon *:hover {
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

.controls .translation {
  display: inline-flex;
  color: var(--color-outer-inner-active);
  align-items: center;
  text-align: center;
  font-size: 250%;
}

.letter-id {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-outer-inner-active);
  background-color: var(--color-outer-inner-inactive);
  font-family: monospace;
  font-size: 1em;
  padding: 2px 4px;
  border-radius: 4px;
}

.letter-image-container {
  padding-top: 15px;
}
</style>
