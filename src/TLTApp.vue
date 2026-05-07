<script setup>
import VerticalSplitter from '@/components/VerticalSplitter.vue'
import HorizontalSplitter from '@/components/HorizontalSplitter.vue'
import RuneKeyboard from '@/components/RuneKeyboard.vue'
</script>

<template>
  <VerticalSplitter left-initial-width="40%">
    <template #left>
      <HorizontalSplitter topInitialHeight="60%">
        <template #top><RuneKeyboard /></template>
        <template #bottom>Letter Editor</template>
      </HorizontalSplitter>
    </template>
    <template #right>Document</template>
  </VerticalSplitter>
</template>

<style scoped></style>
