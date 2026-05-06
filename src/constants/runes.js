import runeUtils from '@/utils/runeUtils.js'

export const RUNES = Object.freeze({
  outerRunes: [
    {
      id: 1,
      type: 'outer',
      edges: new Set([1, 5, 6]),
    },
    {
      id: 2,
      type: 'outer',
      edges: new Set([5, 6]),
    },
    {
      id: 3,
      type: 'outer',
      edges: new Set([3, 4]),
    },
    {
      id: 4,
      type: 'outer',
      edges: new Set([3, 4, 5]),
    },
    {
      id: 5,
      type: 'outer',
      edges: new Set([4, 5]),
    },
    {
      id: 6,
      type: 'outer',
      edges: new Set([1, 6]),
    },
    {
      id: 7,
      type: 'outer',
      edges: new Set([3, 4, 5, 6]),
    },
    {
      id: 8,
      type: 'outer',
      edges: new Set([1, 4, 5, 6]),
    },
    {
      id: 9,
      type: 'outer',
      edges: new Set([1, 4, 5]),
    },
    {
      id: 10,
      type: 'outer',
      edges: new Set([1, 3, 5, 6]),
    },
    {
      id: 11,
      type: 'outer',
      edges: new Set([1, 3, 4, 6]),
    },
    {
      id: 12,
      type: 'outer',
      edges: new Set([3, 5, 6]),
    },
    {
      id: 13,
      type: 'outer',
      edges: new Set([6]),
    },
    {
      id: 14,
      type: 'outer',
      edges: new Set([1]),
    },
    {
      id: 15,
      type: 'outer',
      edges: new Set([4]),
    },
    {
      id: 16,
      type: 'outer',
      edges: new Set([3]),
    },
    {
      id: 17,
      type: 'outer',
      edges: new Set([1, 3, 4, 5, 6]),
    },
    {
      id: 18,
      type: 'outer',
      edges: new Set([3, 5]),
    },
  ],
  innerRunes: [
    {
      id: 1,
      type: 'inner',
      edges: new Set([9, 11]),
    },
    {
      id: 2,
      type: 'inner',
      edges: new Set([9, 11, 12]),
    },
    {
      id: 3,
      type: 'inner',
      edges: new Set([7, 8, 9, 10, 11, 12]),
    },
    {
      id: 4,
      type: 'inner',
      edges: new Set([8, 10]),
    },
    {
      id: 5,
      type: 'inner',
      edges: new Set([7, 9]),
    },
    {
      id: 6,
      type: 'inner',
      edges: new Set([8, 10, 12]),
    },
    {
      id: 7,
      type: 'inner',
      edges: new Set([7, 9, 11]),
    },
    {
      id: 8,
      type: 'inner',
      edges: new Set([7, 8, 9]),
    },
    {
      id: 9,
      type: 'inner',
      edges: new Set([8, 9, 10]),
    },
    {
      id: 10,
      type: 'inner',
      edges: new Set([7, 11]),
    },
    {
      id: 11,
      type: 'inner',
      edges: new Set([10, 12]),
    },
    {
      id: 12,
      type: 'inner',
      edges: new Set([8, 10, 11]),
    },
    {
      id: 13,
      type: 'inner',
      edges: new Set([7, 9, 12]),
    },
    {
      id: 14,
      type: 'inner',
      edges: new Set([7, 8, 10, 12]),
    },
    {
      id: 15,
      type: 'inner',
      edges: new Set([7, 9, 10, 11]),
    },
    {
      id: 16,
      type: 'inner',
      edges: new Set([7, 8, 10, 11]),
    },
    {
      id: 17,
      type: 'inner',
      edges: new Set([7, 9, 10, 12]),
    },
    {
      id: 18,
      type: 'inner',
      edges: new Set([8, 9, 10, 11, 12]),
    },
    {
      id: 19,
      type: 'inner',
      edges: new Set([7, 8, 9, 11, 12]),
    },
    {
      id: 20,
      type: 'inner',
      edges: new Set([7, 9, 10]),
    },
    {
      id: 21,
      type: 'inner',
      edges: new Set([7, 8, 10]),
    },
    {
      id: 22,
      type: 'inner',
      edges: new Set([7, 10, 12]),
    },
    {
      id: 23,
      type: 'inner',
      edges: new Set([8, 12]),
    },
    {
      id: 24,
      type: 'inner',
      edges: new Set([7, 10]),
    },
  ],
})

/**
 * Holds pre-computed maps for looking up runes from edges.
 * The map keys are strings formed by joining the ordered edge IDs with hyphens.
 * Keeping the outer and inner rune lookups separately for now, though maybe that is not necessary
 * and a single "edges key" lookup to rune is good enough and simpler (the rune itself has a "type"
 * property for differentiating inner from outer runes).
 *
 * E.g.
 * EDGES_TO_RUNE_MAPS.outerEdges.get("4-5") // returns the outer rune with id = 5
 * EDGES_TO_RUNE_MAPS.outerEdges.has("5-4") // returns false
 * EDGES_TO_RUNE_MAPS.outerEdges.has("1-2-5") // returns false
 *
 * @type {{outerEdges: Map<string, {id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}>, innerEdges: Map<string, {id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}|{id: number, type: string, edges: Set<number>}>}}
 */
export const EDGES_TO_RUNE_MAPS = {
  outerEdges: new Map(
    RUNES.outerRunes.map((rune) => {
      return [runeUtils.keyForEdges(rune.edges), rune]
    }),
  ),
  innerEdges: new Map(
    RUNES.innerRunes.map((rune) => {
      return [runeUtils.keyForEdges(rune.edges), rune]
    }),
  ),
}
