/**
 * Creates a stable key of type string from the given Set of rune edge IDs.
 * Note that there is no guarantee the particular format (i.e. the default sort implementation
 * against an array of integers converts to string and then sorts alphabetically).
 *
 * E.g.
 *
 * keyForEdges([1,4,3]) = "1-3-4"
 *
 * @param edges {Set} the Set of edge IDs (nunbers) to convert to a key
 * @returns {string} the key representation of the given edges
 */
function keyForEdges(edges) {
  return Array.from(edges).sort().join('-')
}

export default { keyForEdges }
