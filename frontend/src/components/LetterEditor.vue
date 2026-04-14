<template>
  <div class="letter-editor">
    <div class="gem-container">
      <Gem :edges="allEdges" :selected-edges="Array.from(selectedEdges)" @edge-clicked="onEdgeClicked" />
    </div>
    <button @click="onInsert">Insert</button>
  </div>
</template>

<script>
import Gem from './Gem.vue'

export default {
  name: 'LetterEditor',
  components: {
    Gem
  },
  props: {
    selectedEdges: {
      type: Set,
      default: () => new Set()
    }
  },
  data() {
    return {
      allEdges: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13']
    }
  },
  methods: {
    onEdgeClicked(edge) {
      this.$emit('edge-toggled', edge)
    },
    onInsert() {
      // Do nothing
    }
  }
}
</script>

<style scoped>
.letter-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.gem-container {
  max-width: 200px;
  max-height: 200px;
  width: 100%;
  height: auto;
}
</style>
