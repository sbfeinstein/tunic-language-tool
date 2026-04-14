<template>
  <div class="symbol-screen">
    <div class="alphabet-screen">
      <AlphabetScreen @sound-clicked="onSoundClicked" />
    </div>
    <div class="letter-editor">
      <LetterEditor :selected-edges="selectedEdges" @edge-toggled="onEdgeToggled" />
    </div>
  </div>
</template>

<script>
import AlphabetScreen from './AlphabetScreen.vue'
import LetterEditor from './LetterEditor.vue'

export default {
  name: 'SymbolScreen',
  components: {
    AlphabetScreen,
    LetterEditor
  },
  data() {
    return {
      selectedEdges: new Set()
    }
  },
  methods: {
    onSoundClicked(edges) {
      edges.forEach(edge => this.selectedEdges.add(edge))
    },
    onEdgeToggled(edge) {
      if (this.selectedEdges.has(edge)) {
        this.selectedEdges.delete(edge)
      } else {
        this.selectedEdges.add(edge)
      }
    }
  }
}
</script>

<style scoped>
.symbol-screen {
  position: relative;
  height: 100vh;
  width: 100%;
}

.alphabet-screen {
  flex: 0 0 40vh
}

.letter-editor {
  flex: 1;
}
</style>
