<script setup>
import { useId } from 'vue'

defineProps({
  leftInitialWidth: {
    type: String,
    required: false,
    default: '50%',
  }
})

const baseId = useId()
const panelsGridId = `${baseId}-panels-grid`

function resize() {
  const panelsGrid = document.getElementById(panelsGridId)
  const rect = panelsGrid.getBoundingClientRect()

  const onMouseMove = (e) => {
    const newWidth = ((e.clientX - rect.left) / panelsGrid.clientWidth) * 100
    panelsGrid.style.gridTemplateColumns = `${newWidth}% 5px 1fr`
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
      <slot name="left"></slot>
    </div>
    <div class="resizer-v" @mousedown="resize($event)"></div>
    <div class="panel">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.panels-grid {
  display: grid;
  grid-template-columns: v-bind(leftInitialWidth) 5px 1fr;
  height: 100%;
  width: 100%;
}

.panel {
  overflow: auto;
}

.resizer-v {
  background: var(--color-divider-bar);
  cursor: col-resize;
}
</style>
