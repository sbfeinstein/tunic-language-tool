import { reactive } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import DEFAULT_RUNE_TRANSLATIONS from '@/assets/defaultRuneTranslations.json'

export const useRuneTranslationStore = defineStore('rune-translation', () => {
  const outerRuneTranslations = Object.fromEntries(
    DEFAULT_RUNE_TRANSLATIONS.outerRunes.map((data) => [data.id, data]),
  )
  const outer = reactive(outerRuneTranslations)

  const innerRuneTranslations = Object.fromEntries(
    DEFAULT_RUNE_TRANSLATIONS.innerRunes.map((data) => [data.id, data]),
  )
  const inner = reactive(innerRuneTranslations)

  return { outer, inner }
})

// Have Vite rebuild the store if it is updated, including due to edits to the JSON file
// https://pinia.vuejs.org/api/pinia/functions/acceptHMRUpdate.html#hot
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRuneTranslationStore, import.meta.hot))
}
