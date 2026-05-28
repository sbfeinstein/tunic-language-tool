import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapLetterComponent from '@/components/TiptapLetterComponent.vue'

export default Node.create({
  name: 'runeLetter',
  group: 'inline',
  inline: true,
  selectable: false,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      letterID: {
        default: '',
        // Forces the extracted value to be parsed or cast safely as a string
        parseHTML: (element) => {
          const val = element.getAttribute('data-letter-id')
          return val !== null ? String(val) : ''
        },
        renderHTML: (attributes) => {
          return {
            'data-letter-id': attributes.letterID,
          }
        },
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
