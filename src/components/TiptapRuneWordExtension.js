import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapRuneWordComponent from '@/components/TiptapRuneWordComponent.vue'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export default Node.create({
  name: 'runeWord',
  group: 'inline',
  content: 'runeLetter+',
  inline: true,
  selectable: true,
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

          // 1. Split runeWord if it contains non-runeLetter nodes
          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'runeWord') {
              let firstNonRuneIndex = -1
              for (let i = 0; i < node.childCount; i++) {
                if (node.child(i).type.name !== 'runeLetter') {
                  firstNonRuneIndex = i
                  break
                }
              }

              if (firstNonRuneIndex !== -1) {
                // We need to split the runeWord at this point
                // Actually, the schema 'runeLetter+' should already prevent this
                // but if it somehow happens (e.g. through programmatic insertion bypassing schema)
                // we'd handle it here.
                // However, Tiptap's schema is quite strict.
              }
            }
            return true
          })

          // 2. Merge adjacent runeWord nodes
          newState.doc.descendants((node, pos) => {
            if (node.type.name !== 'paragraph') return true

            // We iterate backwards to avoid position shift issues
            for (let i = node.childCount - 1; i > 0; i--) {
              const currentChild = node.child(i)
              const prevChild = node.child(i - 1)

              if (currentChild.type.name === 'runeWord' && prevChild.type.name === 'runeWord') {
                const currentChildPos = pos + 1 + node.offsetAt(i)
                const prevChildPos = pos + 1 + node.offsetAt(i - 1)
                const insertPos = prevChildPos + prevChild.nodeSize - 1

                tr.insert(insertPos, currentChild.content)
                tr.delete(tr.mapping.map(currentChildPos), tr.mapping.map(currentChildPos + currentChild.nodeSize))

                modified = true
              }
            }
            return false
          })

          return modified ? tr : null
        },
      }),
    ]
  },
})
