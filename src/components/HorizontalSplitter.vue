<script setup>
import { useId } from 'vue'

defineProps({
  topInitialHeight: {
    type: String,
    required: false,
    default: '50%',
  },
})

const baseId = useId()
const panelsGridId = `${baseId}-panels-grid`

function resize() {
  const panelsGrid = document.getElementById(panelsGridId)
  const rect = panelsGrid.getBoundingClientRect()

  const onMouseMove = (e) => {
    const newHeightPx = e.clientY - rect.y

    if (newHeightPx > 0 && newHeightPx < rect.height) {
      panelsGrid.style.gridTemplateRows = `${newHeightPx}px 5px 1fr`
    }
  }
  setupListeners(onMouseMove)
}

function setupListeners(moveFunc) {
  const onMouseUp = () => {
    document.removeEventListener('mousemove', moveFunc)
    document.removeEventListener('mouseup', onMouseUp)
  }
  document.addEventListener('mousemove', moveFunc)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div class="panels-grid" :id="panelsGridId">
    <div class="panel">
      <slot name="top"></slot>
    </div>
    <div class="resizer-h" @mousedown="resize($event)"></div>
    <div class="panel">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<style scoped>
.panels-grid {
  display: grid;
  grid-template-rows: v-bind(topInitialHeight) 5px 1fr;
  height: 100%;
  width: 100%;
}

.panel {
  overflow: auto;
}

.resizer-h {
  background: var(--color-divider-bar);
  cursor: row-resize;
}
</style>
