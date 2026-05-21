import { computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import defaultRuneTranslations from '@/assets/defaultRuneTranslations.json'

export const useRuneTranslationStore = defineStore('rune-translation', () => {
  const outer = computed(() => {
    return Object.fromEntries(defaultRuneTranslations.outerRunes.map((data) => [data.id, data]))
  })

  const inner = computed(() => {
    return Object.fromEntries(defaultRuneTranslations.innerRunes.map((data) => [data.id, data]))
  })

  return { outer, inner }
})

// Have Vite rebuild the store if it is updated, including due to edits to the JSON file
// https://pinia.vuejs.org/api/pinia/functions/acceptHMRUpdate.html#hot
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRuneTranslationStore, import.meta.hot))
}
