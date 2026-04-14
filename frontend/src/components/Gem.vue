<template>
  <svg width="100%" height="100%" viewBox="0 0 85 164" @click="onSvgClick">
    <g stroke-width="6" stroke-linecap="round" transform="translate(3,2)">
      <line v-for="edge in edges" :key="edge" :id="edge" :x1="getX1(edge)" :y1="getY1(edge)" :x2="getX2(edge)" :y2="getY2(edge)" :stroke="getStroke(edge)" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'Gem',
  props: {
    edges: {
      type: Array,
      default: () => []
    },
    selectedEdges: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      allEdges: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13'],
      edgeCoords: {
        E1: { x1: 40, y1: 0, x2: 80, y2: 40 },
        E2: { x1: 80, y1: 40, x2: 80, y2: 120 },
        E3: { x1: 40, y1: 160, x2: 80, y2: 120 },
        E4: { x1: 0, y1: 120, x2: 40, y2: 160 },
        E5: { x1: 0, y1: 40, x2: 0, y2: 120 },
        E6: { x1: 0, y1: 40, x2: 40, y2: 0 },
        E7: { x1: 40, y1: 0, x2: 40, y2: 80 },
        E8: { x1: 40, y1: 80, x2: 80, y2: 40 },
        E9: { x1: 40, y1: 80, x2: 80, y2: 120 },
        E10: { x1: 40, y1: 80, x2: 40, y2: 160 },
        E11: { x1: 0, y1: 120, x2: 40, y2: 80 },
        E12: { x1: 0, y1: 40, x2: 40, y2: 80 },
        E13: { x1: 0, y1: 80, x2: 80, y2: 80 }
      }
    }
  },
  methods: {
    getX1(edge) {
      return this.edgeCoords[edge].x1
    },
    getY1(edge) {
      return this.edgeCoords[edge].y1
    },
    getX2(edge) {
      return this.edgeCoords[edge].x2
    },
    getY2(edge) {
      return this.edgeCoords[edge].y2
    },
    getStroke(edge) {
      if (this.selectedEdges.includes(edge)) {
        return '#050d3a'
      } else {
        return 'lightgray'
      }
    },
    onSvgClick(event) {
      const target = event.target
      if (target.tagName === 'line') {
        this.$emit('edge-clicked', target.id)
      }
    }
  }
}
</script>
