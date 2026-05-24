import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapLetterComponent from '@/components/TiptapLetterComponent.vue'

export default Node.create({
  name: 'runeLetter',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      letterID: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'rune-letter',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['rune-letter', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapLetterComponent)
  },
})
