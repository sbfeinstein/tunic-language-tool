<script setup>
import VerticalSplitter from '@/components/VerticalSplitter.vue'
import HorizontalSplitter from '@/components/HorizontalSplitter.vue'
import RuneKeyboard from '@/components/RuneKeyboard.vue'
import LetterEditor from '@/components/LetterEditor.vue'
import { ref } from 'vue'

const selectedRune = ref(null)

const handleSelectedRune = (rune) => {
  selectedRune.value = rune
}
</script>

<template>
  <VerticalSplitter left-initial-width="50%">
    <template #left>
      <HorizontalSplitter top-initial-height="65%">
        <template #top><RuneKeyboard @runeSelected="handleSelectedRune" /></template>
        <template #bottom><LetterEditor :input-rune="selectedRune" /></template>
      </HorizontalSplitter>
    </template>
    <template #right>Document</template>
  </VerticalSplitter>
</template>

<style scoped></style>
