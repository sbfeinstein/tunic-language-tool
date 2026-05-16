import runeUtils from '@/utils/runeUtils.js'

/**
 * @typedef {object} RuneLine
 * @property {string} id - The unique identifier for the line within its type
 * @property {string} x1 - Starting X coordinate
 * @property {string} y1 - Starting Y coordinate
 * @property {string} x2 - Ending X coordinate
 * @property {string} y2 - Ending Y coordinate
 * @property {'outer'|'inner'} type - The line classification type
 */

/**
 * @typedef {object} RuneCircle
 * @property {string} cx - Center X coordinate
 * @property {string} cy - Center Y coordinate
 * @property {string} r - Circle radius
 */

/**
 * @typedef {object} RuneSvgData
 * @property {string} svgViewBox - The viewBox dimensions for the rune SVG
 * @property {object} lines - Contains groupings for outer and inner lines
 * @property {Object<string, RuneLine>} lines.outer - Map of outer lines
 * @property {Object<string, RuneLine>} lines.inner - Map of inner lines
 * @property {RuneCircle} circle - Rune's circle element
 */

/**
 * The SVG shapes that constitute an individual rune.
 *
 * Note that these shapes are different from those required to render a "letter", which consists
 * of up to two runes superimposed (plus additional differences relative to how runes are
 * rendered).
 *
 * This is a constant rather than inlined in a Component since there are multiple cotexts in
 * which Rune SVGs need to be dynamically generated.
 *
 */
/** @type {RuneSvgData} */
export const RUNE_SVG_DATA = Object.freeze({
  svgViewBox: '0 0 85 180',
  lines: {
    outer: {
      1: { id: '1', x1: '40', y1: '0', x2: '80', y2: '40', type: 'outer' },
      2: { id: '2', x1: '80', y1: '40', x2: '80', y2: '120', type: 'outer' },
      3: { id: '3', x1: '40', y1: '160', x2: '80', y2: '120', type: 'outer' },
      4: { id: '4', x1: '0', y1: '120', x2: '40', y2: '160', type: 'outer' },
      5: { id: '5', x1: '0', y1: '40', x2: '0', y2: '120', type: 'outer' },
      6: { id: '6', x1: '0', y1: '40', x2: '40', y2: '0', type: 'outer' },
    },
    inner: {
      7: { id: '7', x1: '40', y1: '0', x2: '40', y2: '80', type: 'inner' },
      8: { id: '8', x1: '40', y1: '80', x2: '80', y2: '40', type: 'inner' },
      9: { id: '9', x1: '40', y1: '80', x2: '80', y2: '120', type: 'inner' },
      10: { id: '10', x1: '40', y1: '80', x2: '40', y2: '160', type: 'inner' },
      11: { id: '11', x1: '0', y1: '120', x2: '40', y2: '80', type: 'inner' },
      12: { id: '12', x1: '0', y1: '40', x2: '40', y2: '80', type: 'inner' },
    },
  },
  circle: {
    cx: '40',
    cy: '160',
    r: '12',
  },
})

export const OUTER_LINE_IDS = Object.keys(RUNE_SVG_DATA.lines.outer)
export const INNER_LINE_IDS = Object.keys(RUNE_SVG_DATA.lines.inner)

export const RUNES = Object.freeze({
  outerRunes: [
    {
      id: '01',
      type: 'outer',
      lines: ['1', '5', '6'],
    },
    {
      id: '02',
      type: 'outer',
      lines: ['5', '6'],
    },
    {
      id: '03',
      type: 'outer',
      lines: ['3', '4'],
    },
    {
      id: '04',
      type: 'outer',
      lines: ['3', '4', '5'],
    },
    {
      id: '05',
      type: 'outer',
      lines: ['4', '5'],
    },
    {
      id: '06',
      type: 'outer',
      lines: ['1', '6'],
    },
    {
      id: '07',
      type: 'outer',
      lines: ['3', '4', '5', '6'],
    },
    {
      id: '08',
      type: 'outer',
      lines: ['1', '4', '5', '6'],
    },
    {
      id: '09',
      type: 'outer',
      lines: ['1', '4', '5'],
    },
    {
      id: '10',
      type: 'outer',
      lines: ['1', '3', '5', '6'],
    },
    {
      id: '11',
      type: 'outer',
      lines: ['1', '3', '4', '6'],
    },
    {
      id: '12',
      type: 'outer',
      lines: ['3', '5', '6'],
    },
    {
      id: '13',
      type: 'outer',
      lines: ['6'],
    },
    {
      id: '14',
      type: 'outer',
      lines: ['1'],
    },
    {
      id: '15',
      type: 'outer',
      lines: ['4'],
    },
    {
      id: '16',
      type: 'outer',
      lines: ['3'],
    },
    {
      id: '17',
      type: 'outer',
      lines: ['1', '3', '4', '5', '6'],
    },
    {
      id: '18',
      type: 'outer',
      lines: ['3', '5'],
    },
  ],
  innerRunes: [
    {
      id: '01',
      type: 'inner',
      lines: ['9', '11'],
    },
    {
      id: '02',
      type: 'inner',
      lines: ['9', '11', '12'],
    },
    {
      id: '03',
      type: 'inner',
      lines: ['7', '8', '9', '10', '11', '12'],
    },
    {
      id: '04',
      type: 'inner',
      lines: ['8', '10'],
    },
    {
      id: '05',
      type: 'inner',
      lines: ['7', '9'],
    },
    {
      id: '06',
      type: 'inner',
      lines: ['8', '10', '12'],
    },
    {
      id: '07',
      type: 'inner',
      lines: ['7', '9', '11'],
    },
    {
      id: '08',
      type: 'inner',
      lines: ['7', '8', '9'],
    },
    {
      id: '09',
      type: 'inner',
      lines: ['8', '9', '10'],
    },
    {
      id: '10',
      type: 'inner',
      lines: ['7', '11'],
    },
    {
      id: '11',
      type: 'inner',
      lines: ['10', '12'],
    },
    {
      id: '12',
      type: 'inner',
      lines: ['8', '10', '11'],
    },
    {
      id: '13',
      type: 'inner',
      lines: ['7', '9', '12'],
    },
    {
      id: '14',
      type: 'inner',
      lines: ['7', '8', '10', '12'],
    },
    {
      id: '15',
      type: 'inner',
      lines: ['7', '9', '10', '11'],
    },
    {
      id: '16',
      type: 'inner',
      lines: ['7', '8', '10', '11'],
    },
    {
      id: '17',
      type: 'inner',
      lines: ['7', '9', '10', '12'],
    },
    {
      id: '18',
      type: 'inner',
      lines: ['8', '9', '10', '11', '12'],
    },
    {
      id: '19',
      type: 'inner',
      lines: ['7', '8', '9', '11', '12'],
    },
    {
      id: '20',
      type: 'inner',
      lines: ['7', '9', '10'],
    },
    {
      id: '21',
      type: 'inner',
      lines: ['7', '8', '10'],
    },
    {
      id: '22',
      type: 'inner',
      lines: ['7', '10', '12'],
    },
    {
      id: '23',
      type: 'inner',
      lines: ['8', '12'],
    },
    {
      id: '24',
      type: 'inner',
      lines: ['7', '10'],
    },
  ],
})

/**
 * A map of rune key => rune
 *
 * E.g.
 * RUNES_BY_KEY["4-5"] // returns the outer rune with id of '05'
 * RUNES_BY_KEY["5-4"] // returns null
 * RUNES_BY_KEY["1-2-5"] // returns null
 *
 */
export const RUNES_BY_KEY = Object.fromEntries([
  ...RUNES.outerRunes.map((rune) => [runeUtils.runeKeyFor(rune.lines), rune]),
  ...RUNES.innerRunes.map((rune) => [runeUtils.runeKeyFor(rune.lines), rune]),
])
