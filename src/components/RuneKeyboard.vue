<script setup>
import { RUNES } from '@/constants/runes.js'
import RuneCard from '@/components/RuneCard.vue'
</script>

<template>
  <div class="keyboard-grid">
    <span class="header-row outer-runes-header">Outer Runes</span>
    <RuneCard v-for="rune in RUNES.outerRunes" :key="'rune-outer-' + rune.id" :rune="rune" />
    <span class="header-row inner-runes-header">Inner Runes</span>
    <RuneCard v-for="rune in RUNES.innerRunes" :key="'rune-inner-' + rune.id" :rune="rune" />
  </div>
</template>

<style scoped>
.keyboard-grid {
  display: grid;
  justify-self: start;
  align-self: start;
  width: 100%;
  height: 100%;
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);

  /* Cols: 6 content columns */
  grid-template-columns: repeat(6, 1fr);
  /* Rows: Outer Runes subheader, 3 content rows, Inner Runes subheader, 4 content rows */
  grid-template-rows: auto repeat(3, 1fr) auto repeat(4, 1fr);
}

.header-row {
  grid-column: 1/7;
  min-height: 0;
  padding-left: 1em;
}

.outer-runes-header {
  background-color: var(--color-outer-runes);
}

.inner-runes-header {
  background-color: var(--color-inner-runes);
}
</style>
