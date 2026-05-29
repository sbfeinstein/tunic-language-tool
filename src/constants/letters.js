export const LETTER_SVG_VITE_MODULES = import.meta.glob('/src/assets/letters/unstyled/*.svg', {
  query: '?raw',
  import: 'default',
})

export const LETTER_SVG_DATA = Object.freeze({
  svgViewBox: '0 0 85 180',
  lines: {
    outer: {
      1: { id: '1', x1: '50', y1: '10', x2: '100', y2: '35', type: 'outer' },
      2: { id: '2', x1: '100', y1: '35', x2: '100', y2: '70', type: 'outer' },
      '2b': { id: '2b', x1: '100', y1: '105', x2: '100', y2: '85', type: 'outer' },
      3: { id: '3', x1: '50', y1: '125', x2: '100', y2: '105', type: 'outer' },
      4: { id: '4', x1: '8', y1: '105', x2: '50', y2: '125', type: 'outer' },
      5: { id: '5', x1: '8', y1: '105', x2: '8', y2: '85', type: 'outer' },
      '5b': { id: '5b', x1: '8', y1: '35', x2: '8', y2: '70', type: 'outer' },
      6: { id: '6', x1: '8', y1: '35', x2: '50', y2: '10', type: 'outer' },
    },
    inner: {
      7: { id: '7', x1: '50', y1: '10', x2: '50', y2: '70', type: 'inner' },
      '7b': { id: '7b', x1: '50', y1: '55', x2: '50', y2: '70', type: 'inner' },
      8: { id: '8', x1: '50', y1: '55', x2: '100', y2: '35', type: 'inner' },
      9: { id: '9', x1: '50', y1: '85', x2: '100', y2: '105', type: 'inner' },
      10: { id: '10', x1: '50', y1: '85', x2: '50', y2: '125', type: 'inner' },
      11: { id: '11', x1: '8', y1: '105', x2: '50', y2: '85', type: 'inner' },
      12: { id: '12', x1: '8', y1: '35', x2: '50', y2: '55', type: 'inner' },
      13: { id: '13', x1: '8', y1: '70', x2: '100', y2: '70', type: 'inner' },
    },
  },
  circle: {
    cx: '50',
    cy: '140',
    r: '10',
  },
})

export const RUNE_LINES_TO_LETTER_LINES = Object.freeze({
  outer: {
    1: ['1'],
    2: ['2', '2b'],
    3: ['3'],
    4: ['4'],
    5: ['5', '5b'],
    6: ['6'],
  },
  inner: {
    7: ['7', '7b'],
    8: ['8', '7b'],
    9: ['9'],
    10: ['10'],
    11: ['11'],
    12: ['12', '7b'],
  },
})
