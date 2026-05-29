import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapRuneWordComponent from '@/components/TiptapRuneWordComponent.vue'
import { Plugin, PluginKey } from '@tiptap/pm/state'

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
