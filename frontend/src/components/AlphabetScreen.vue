<template>
  <div class="alphabet-screen">
    <div class="grid">
      <div v-for="sound in sounds" :key="sound.id" class="cell" @click="onCellClick(sound)">
        <Gem :edges="allEdges" :selected-edges="sound.edges" />
      </div>
    </div>
  </div>
</template>

<script>
import Gem from './Gem.vue'

export default {
  name: 'AlphabetScreen',
  components: {
    Gem
  },
  data() {
    return {
      sounds: [],
      allEdges: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13']
    }
  },
  async mounted() {
    const response = await fetch('/api/sounds')
    this.sounds = await response.json()
  },
  methods: {
    onCellClick(sound) {
      this.$emit('sound-clicked', sound.edges)
    }
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(20px, 1fr));
  grid-template-rows: repeat(7, minmax(40px, 1fr));
  gap: 5px;
}

.cell {
  border: 1px solid rgb(204 204 204 / 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
