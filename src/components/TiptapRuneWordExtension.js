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

/**
 * Build a transaction that inserts `text` over the range [from, to] when that
 * range lies wholly inside a single runeWord: the word is split at the caret and
 * the text dropped between the two halves (an empty half is omitted, so the
 * caret being at a word edge just places the text outside that edge). Returns
 * null when the range is not contained in one runeWord.
 */
const splitRuneWordForText = (state, from, to, text) => {
  const $from = state.doc.resolve(from)
  if ($from.parent.type.name !== 'runeWord') return null
  if (to > $from.end()) return null

  const word = $from.parent
  const runeWordType = state.schema.nodes.runeWord
  const before = word.content.cut(0, from - $from.start())
  const after = word.content.cut(to - $from.start())

  const pieces = []
  if (before.size) pieces.push(runeWordType.create(null, before))
  pieces.push(state.schema.text(text))
  if (after.size) pieces.push(runeWordType.create(null, after))

  const wordStart = $from.before()
  const tr = state.tr.replaceWith(wordStart, $from.after(), pieces)

  // Place the caret just after the inserted text.
  const beforeSize = before.size ? before.size + 2 : 0
  tr.setSelection(TextSelection.create(tr.doc, wordStart + beforeSize + text.length))
  return tr.scrollIntoView()
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
        props: {
          // A runeWord only accepts runeLetters, so text typed while the caret is
          // inside one is a schema-invalid edit that ProseMirror reverts before
          // its handleTextInput path runs. Catch it at the raw DOM level instead,
          // before the edit is attempted, and split the word around the text.
          handleDOMEvents: {
            beforeinput: (view, event) => {
              if (event.inputType !== 'insertText' || event.data == null) return false
              const { from, to } = view.state.selection
              const tr = splitRuneWordForText(view.state, from, to, event.data)
              if (!tr) return false
              event.preventDefault()
              view.dispatch(tr)
              return true
            },
          },
        },
        // Normalize inline rune content: collapse every maximal run of
        // directly-adjacent rune nodes (loose runeLetters and/or runeWords)
        // into a single runeWord. Rune words separated by text are left alone.
        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some((tr) => tr.docChanged)) return null

          const runeWordType = newState.schema.nodes.runeWord
          const isRune = (node) =>
            node.type.name === 'runeLetter' || node.type.name === 'runeWord'

          // Collect replacement ranges from the (unchanging) new doc so we can
          // apply them last-to-first below without remapping positions.
          const replacements = []

          newState.doc.descendants((node, pos) => {
            if (!node.isTextblock) return true

            const children = []
            node.forEach((child, offset) => children.push({ child, offset }))

            for (let i = 0; i < children.length; ) {
              if (!isRune(children[i].child)) {
                i++
                continue
              }

              // Gather the contiguous run of rune nodes, flattening their letters.
              const letters = []
              let j = i
              while (j < children.length && isRune(children[j].child)) {
                const runeNode = children[j].child
                if (runeNode.type.name === 'runeLetter') {
                  letters.push(runeNode)
                } else {
                  runeNode.forEach((letter) => letters.push(letter))
                }
                j++
              }

              // Skip runs that are already a single, well-formed runeWord — this
              // keeps the transformation idempotent (its own output re-runs clean).
              const alreadyNormalized =
                j - i === 1 && children[i].child.type.name === 'runeWord'
              if (!alreadyNormalized) {
                const first = children[i]
                const last = children[j - 1]
                replacements.push({
                  from: pos + 1 + first.offset,
                  to: pos + 1 + last.offset + last.child.nodeSize,
                  runeWord: runeWordType.create(null, letters),
                })
              }
              i = j
            }

            return false
          })

          if (!replacements.length) return null

          const { tr } = newState
          for (let k = replacements.length - 1; k >= 0; k--) {
            const { from, to, runeWord } = replacements[k]
            tr.replaceWith(from, to, runeWord)
          }
          return tr
        },
      }),
    ]
  },
})
