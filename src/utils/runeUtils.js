/**
 * Creates a stable key of type string from the given rune line IDs.
 * Note that there is no guarantee the particular format (i.e. the default sort implementation
 * against an array of integers converts to string and then sorts alphabetically).
 *
 * E.g.
 *
 * runeKeyFor(['1', '4', '3']) = "1-3-4"
 * runeKeyFor(['1', '4', '3', '4']) = "1-3-4"
 *
 * @param lineIDs {array<string>} the line IDs to convert to a key
 * @returns {string} the key representation of the given line IDs
 */
function runeKeyFor(lineIDs) {
  return [...new Set(lineIDs)].sort().join('-')
}

export default { runeKeyFor }

