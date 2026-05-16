import { defineStore } from 'pinia'
import { computed, reactive, useId } from 'vue'
import { RUNE_SVG_DATA, RUNES_BY_KEY } from '@/constants/runes.js'
import runeUtils from '@/utils/runeUtils.js'

/**
 * @typedef {object} EditorRuneLine
 * @extends {RuneLine}
 * @property {string} key
 * @property {boolean} active
 */

/**
 * @typedef {object} EditorRuneCircle
 * @extends {RuneCircle}
 * @property {boolean} active
 */

/**
 * @typedef {object} EditorRuneSvgData
 * @extends {RuneSvgData}
 * @property {Object<string, EditorRuneLine>} lines.outer
 * @property {Object<string, EditorRuneLine>} lines.inner
 * @property {EditorRuneCircle} circle
 */

/*
 * The editor's store holds the data that it needs to render the rune being edited.
 * Only state that is relevant to components outside of the editor must be included and
 * are the focus of the design.  Some additional properties may be included for convenience.
 **/
export const useEditorStore = defineStore('editor', () => {
  // Build reactive store (dataRef)
  // --------------------------------------------------------------------------------

  // Clone the stateless rune data and decorate it with stateful properties
  /** @type {EditorRuneSvgData} */
  const data = /** @type {EditorRuneSvgData} */ structuredClone(RUNE_SVG_DATA)

  // lines - the editor's rune lines, grouped by outer and inner
  // Decorated with an 'active' flag and a 'key' to support VueJS rendering.
  const baseId = useId()
  Object.keys(data.lines.outer).forEach((id) => {
    data.lines.outer[id].key = `${baseId}-${id}`
    data.lines.outer[id].active = false
  })
  Object.keys(data.lines.inner).forEach((id) => {
    data.lines.inner[id].key = `${baseId}-${id}`
    data.lines.inner[id].active = false
  })

  // circle - the editor's rune circle
  // Decorated with an 'active' flag.
  data.circle.active = false

  const dataRef = reactive(data)

  // Computed helpers and conveniences
  // --------------------------------------------------------------------------------

  const circleActive = computed(() => dataRef.circle.active)

  // activeLines and inactiveLines - alternative groupings for convenience
  const activeLines = computed(() =>
    Object.fromEntries(
      Object.values([...Object.values(dataRef.lines.outer), ...Object.values(dataRef.lines.inner)])
        .filter((line) => line.active)
        .map((line) => [line.id, line]),
    ),
  )
  const inactiveLines = computed(() =>
    Object.fromEntries(
      Object.values([...Object.values(dataRef.lines.outer), ...Object.values(dataRef.lines.inner)])
        .filter((line) => !line.active)
        .map((line) => [line.id, line]),
    ),
  )

  // outer and inner selection helpers
  const outerRuneEmpty = computed(() =>
    Object.values(dataRef.lines.outer).every((line) => !line.active),
  )
  const outerRuneMatch = computed(() => {
    const runeKey = runeUtils.runeKeyFor(
      Object.values(dataRef.lines.outer)
        .filter((line) => line.active)
        .map((line) => line.id),
    )
    return RUNES_BY_KEY[runeKey]
  })
  const outerRuneInvalid = computed(() => !outerRuneEmpty.value && !outerRuneMatch.value)

  const innerRuneEmpty = computed(() =>
    Object.values(dataRef.lines.inner).every((line) => !line.active),
  )
  const innerRuneMatch = computed(() => {
    const runeKey = runeUtils.runeKeyFor(
      Object.values(dataRef.lines.inner)
        .filter((line) => line.active)
        .map((line) => line.id),
    )
    return RUNES_BY_KEY[runeKey]
  })
  const innerRuneInvalid = computed(() => !innerRuneEmpty.value && !innerRuneMatch.value)

  // Published by store
  // --------------------------------------------------------------------------------

  return {
    dataRef,
    activeLines,
    inactiveLines,
    outerRuneEmpty,
    outerRuneMatch,
    outerRuneInvalid,
    innerRuneEmpty,
    innerRuneMatch,
    innerRuneInvalid,
    circleActive,
  }
})
