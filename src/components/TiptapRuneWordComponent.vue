<script setup>
import { computed, useId } from 'vue'
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import EditorSelectionTranslationText from '@/components/EditorSelectionTranslationText.vue'

const props = defineProps(nodeViewProps)

const letters = computed(() => {
  const ids = []
  props.node.content.forEach((node) => {
    if (node.type.name === 'runeLetter') {
      const letterID = node.attrs.letterID
      ids.push({
        id: letterID,
        innerRuneID: letterID.slice(0, 2),
        outerRuneID: letterID.slice(2, 4),
        circleActive: letterID[4] === '1',
      })
    }
  })
  return ids
})

const baseId = useId()
</script>

<template>
  <node-view-wrapper class="rune-word">
    <span class="letters-container">
      <node-view-content />
    </span>
    <span class="translation-placeholder">
      <span v-for="letter in letters" :key="`${baseId}-${letter.id}-for`">
        <EditorSelectionTranslationText
          position="first"
          :innerRuneID="letter.innerRuneID"
          :outerRuneID="letter.outerRuneID"
          :circleActive="letter.circleActive"
          :key="`${baseId}-${letter.id}-first`"
        />
        <EditorSelectionTranslationText
          position="second"
          :innerRuneID="letter.innerRuneID"
          :outerRuneID="letter.outerRuneID"
          :circleActive="letter.circleActive"
          :key="`${baseId}-${letter.id}-second`"
        />
      </span>
    </span>
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
  font-size: 0.8em;
  color: var(--color-outer-inner-active);
  text-align: center;
  margin-top: -4px;
  font-family: sans-serif;
  letter-spacing: 0.1em;
}

:deep(.rune-letter) {
  margin: 0 -2px;
}
</style>
