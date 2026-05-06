<script setup>
import HorizontalPanels from '@/components/HorizontalPanels.vue'
import VerticalPanels from '@/components/VerticalPanels.vue'
import RuneKeyboard from '@/components/RuneKeyboard.vue'
</script>

<template>
  <HorizontalPanels left-initial-width="40%">
    <template #left>
      <VerticalPanels topInitialHeight="60%">
        <template #top>
          <RuneKeyboard />
        </template>
        <template #bottom>Letter Editor</template>
      </VerticalPanels>
    </template>
    <template #right>Document</template>
  </HorizontalPanels>
</template>

<style scoped></style>
