import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapRuneWordComponent from '@/components/TiptapRuneWordComponent.vue'
import { Plugin, PluginKey, Selection, TextSelection } from '@tiptap/pm/state'

/**
 * Move the caret (or extend the selection) one position left/right through the
 * model, dispatching the selection directly instead of relying on native
 * browser caret movement.
 *
 * The runeWord node view renders as a nested inline-flex/SVG element, which the
 * browser refuses to step the caret into, so arrow keys get stuck at the
 * boundary — both for plain caret movement and for Shift-extended selections.
 * We only take over when a runeWord is adjacent to (or contains) the moving
 * head; otherwise we return false so plain text navigation behaves normally.
 *
 * When `extend` is true the anchor stays fixed and only the head moves, which
 * preserves Shift+Arrow selection semantics.
 */
const moveThroughRuneWord = (dir, extend = false) => ({ state, dispatch }) => {
  const { selection } = state
  if (!extend && !selection.empty) return false

  const { $head } = selection
  const insideRuneWord = $head.parent.type.name === 'runeWord'
  const neighbor = dir === 1 ? $head.nodeAfter : $head.nodeBefore
  const touchingRuneWord = neighbor?.type.name === 'runeWord'
  if (!insideRuneWord && !touchingRuneWord) return false

  const target = selection.head + dir
  if (target < 0 || target > state.doc.content.size) return false

  const $target = state.doc.resolve(target)
  const nextSelection = extend
    ? TextSelection.between(selection.$anchor, $target, dir)
    : Selection.near($target, dir)
  if (nextSelection.eq(selection)) return false

  if (dispatch) dispatch(state.tr.setSelection(nextSelection).scrollIntoView())
  return true
}

/** Two caret rects share a visual line when their vertical extents overlap. */
const sameVisualLine = (a, b) => a.bottom > b.top + 1 && a.top < b.bottom - 1

/**
 * Walk positions outward from `fromPos` (within [blockStart, blockEnd]) until
 * the caret rect leaves the current visual line, returning the last position
 * still on that line. Uses layout coordinates so it tracks soft-wrapped lines.
 */
const findLineEdge = (view, fromPos, dir, blockStart, blockEnd) => {
  let ref
  try {
    ref = view.coordsAtPos(fromPos)
  } catch {
    return fromPos
  }
  const limit = dir === 1 ? blockEnd : blockStart
  let best = fromPos
  for (let pos = fromPos + dir; dir === 1 ? pos <= limit : pos >= limit; pos += dir) {
    let coords
    try {
      coords = view.coordsAtPos(pos)
    } catch {
      break
    }
    if (!sameVisualLine(coords, ref)) break
    best = pos
  }
  return best
}

/**
 * Move (or extend) the selection to the start/end of the current visual line.
 *
 * macOS Cmd+Arrow / Home / End delegate to the browser, whose line-edge
 * calculation overshoots to the document edge when the caret starts inside the
 * runeWord node view. We only take over in that case and compute the edge from
 * layout coordinates so normal text keeps native behavior.
 */
const moveToLineEdge = (dir, extend = false) => ({ state, view, dispatch, tr }) => {
  const { selection } = state
  const { $head } = selection
  if ($head.parent.type.name !== 'runeWord') return false

  // Find the enclosing textblock (the paragraph) to bound the search.
  let depth = $head.depth
  while (depth > 0 && !$head.node(depth).isTextblock) depth--
  const blockStart = $head.start(depth)
  const blockEnd = $head.end(depth)

  const target = findLineEdge(view, selection.head, dir, blockStart, blockEnd)
  const $target = state.doc.resolve(target)
  const nextSelection = extend
    ? TextSelection.between(selection.$anchor, $target, dir)
    : Selection.near($target, dir)

  // Always swallow the key when inside a runeWord — falling through would let
  // the browser jump to the document edge.
  if (dispatch && !nextSelection.eq(selection)) {
    dispatch(tr.setSelection(nextSelection).scrollIntoView())
  }
  return true
}

/**
 * Find the position on the visual line above/below the caret, keeping roughly
 * the same horizontal offset. Probes outward in layout space until it lands on
 * a position that is on a different visual line, returning null if none exists
 * (e.g. already on the first/last line).
 */
const findVerticalTarget = (view, fromPos, dir) => {
  let ref
  try {
    ref = view.coordsAtPos(fromPos)
  } catch {
    return null
  }
  const startY = dir === 1 ? ref.bottom : ref.top
  for (let step = 1; step <= 120; step += 4) {
    const found = view.posAtCoords({ left: ref.left, top: startY + dir * step })
    if (!found) continue
    let coords
    try {
      coords = view.coordsAtPos(found.pos)
    } catch {
      continue
    }
    if (!sameVisualLine(coords, ref)) return found.pos
  }
  return null
}

/**
 * Move (or extend) the selection up/down a visual line.
 *
 * Inside the runeWord node view there is no line above/below for the browser to
 * reach, so native ArrowUp/ArrowDown just collapse to the rune word's edges. We
 * take over only in that case and resolve the adjacent line via layout coords.
 */
const moveVertical = (dir, extend = false) => ({ state, view, dispatch, tr }) => {
  const { selection } = state
  const { $head } = selection
  if ($head.parent.type.name !== 'runeWord') return false

  let target = findVerticalTarget(view, selection.head, dir)
  if (target == null) {
    // No adjacent line — fall back to the line edge, like native does.
    let depth = $head.depth
    while (depth > 0 && !$head.node(depth).isTextblock) depth--
    target = findLineEdge(view, selection.head, dir, $head.start(depth), $head.end(depth))
  }

  const $target = state.doc.resolve(target)
  const nextSelection = extend
    ? TextSelection.between(selection.$anchor, $target, dir)
    : Selection.near($target, dir)

  if (dispatch && !nextSelection.eq(selection)) {
    dispatch(tr.setSelection(nextSelection).scrollIntoView())
  }
  return true
}

export default Node.create({
  name: 'runeWord',
  group: 'inline',
  content: 'runeLetter+',
  inline: true,
  selectable: false,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'rune-word',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['rune-word', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapRuneWordComponent)
  },

  addKeyboardShortcuts() {
    return {
      ArrowRight: () => this.editor.commands.command(moveThroughRuneWord(1)),
      ArrowLeft: () => this.editor.commands.command(moveThroughRuneWord(-1)),
      'Shift-ArrowRight': () => this.editor.commands.command(moveThroughRuneWord(1, true)),
      'Shift-ArrowLeft': () => this.editor.commands.command(moveThroughRuneWord(-1, true)),
      'Mod-ArrowRight': () => this.editor.commands.command(moveToLineEdge(1)),
      'Mod-ArrowLeft': () => this.editor.commands.command(moveToLineEdge(-1)),
      'Mod-Shift-ArrowRight': () => this.editor.commands.command(moveToLineEdge(1, true)),
      'Mod-Shift-ArrowLeft': () => this.editor.commands.command(moveToLineEdge(-1, true)),
      End: () => this.editor.commands.command(moveToLineEdge(1)),
      Home: () => this.editor.commands.command(moveToLineEdge(-1)),
      'Shift-End': () => this.editor.commands.command(moveToLineEdge(1, true)),
      'Shift-Home': () => this.editor.commands.command(moveToLineEdge(-1, true)),
      ArrowDown: () => this.editor.commands.command(moveVertical(1)),
      ArrowUp: () => this.editor.commands.command(moveVertical(-1)),
      'Shift-ArrowDown': () => this.editor.commands.command(moveVertical(1, true)),
      'Shift-ArrowUp': () => this.editor.commands.command(moveVertical(-1, true)),
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('runeWordAutoMerge'),
        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some((tr) => tr.docChanged)) return null

          const { tr } = newState
          let modified = false

          // 1. Wrap isolated runeLetter nodes into runeWord
          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'runeLetter') {
              const $pos = newState.doc.resolve(pos)
              const parent = $pos.parent
              if (parent.type.name !== 'runeWord') {
                // This runeLetter is not inside a runeWord, wrap it
                const runeWord = newState.schema.nodes.runeWord.create(null, node)
                tr.replaceWith(tr.mapping.map(pos), tr.mapping.map(pos + node.nodeSize), runeWord)
                modified = true
              }
            }
            return true
          })

          // 2. Merge adjacent runeWord nodes
          const mergeRuneWords = (transaction) => {
            const currentDoc = transaction.doc
            let merged = false
            currentDoc.descendants((node, pos) => {
              if (node.isLeaf || node.type.name === 'runeWord') return false

              for (let i = node.childCount - 1; i > 0; i--) {
                const currentChild = node.child(i)
                const prevChild = node.child(i - 1)

                if (currentChild.type.name === 'runeWord' && prevChild.type.name === 'runeWord') {
                  const currentChildPos = pos + 1 + node.offsetAt(i)
                  const prevChildPos = pos + 1 + node.offsetAt(i - 1)

                  const mappedCurrentChildPos = transaction.mapping.map(currentChildPos)
                  const mappedPrevChildPos = transaction.mapping.map(prevChildPos)

                  // Position to insert content of currentChild into prevChild
                  const insertPos = mappedPrevChildPos + prevChild.nodeSize - 1

                  transaction.insert(insertPos, currentChild.content)
                  transaction.delete(
                    transaction.mapping.map(currentChildPos),
                    transaction.mapping.map(currentChildPos + currentChild.nodeSize),
                  )
                  merged = true
                }
              }
              return true
            })
            return merged
          }

          let finalTr = tr
          while (mergeRuneWords(finalTr)) {
            modified = true
          }

          return modified ? finalTr : null
        },
      }),
    ]
  },
})
