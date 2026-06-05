import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import DEFAULT_RUNE_TRANSLATIONS from '@/assets/defaultRuneTranslations.json'

export const useRuneTranslationStore = defineStore('rune-translation', () => {
  const _mapRuneTranslations = (translations) =>
    Object.fromEntries(translations.map((data) => [String(data.id), data]))

  const loadRuneTranslations = (translations) => {
    outer.value = _mapRuneTranslations(structuredClone(translations.outerRunes))
    inner.value = _mapRuneTranslations(structuredClone(translations.innerRunes))
  }

  const outer = ref({})
  const inner = ref({})

  loadRuneTranslations(DEFAULT_RUNE_TRANSLATIONS)

  return { outer, inner, loadRuneTranslations }
})
