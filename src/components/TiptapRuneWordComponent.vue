<script setup>
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'

</script>

<template>
  <node-view-wrapper class="rune-word">
    <div class="letters-container">
      <node-view-content />
    </div>
    <div class="translation-placeholder">
      translation
    </div>
  </node-view-wrapper>
</template>

<style scoped>
.rune-word {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin: 0 4px;
  border: 1px transparent solid;
  transition: border-color 0.2s;
}

.rune-word:hover {
  border-color: var(--color-outer-inner-inactive);
  border-radius: 4px;
}

.letters-container {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}

.translation-placeholder {
  font-size: 0.4em;
  color: var(--color-outer-inner-active);
  text-align: center;
  margin-top: -4px;
  font-family: sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

:deep(.rune-letter) {
  margin: 0 -2px;
}
</style>
