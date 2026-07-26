import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import DEFAULT_RUNE_TRANSLATIONS from '@/assets/defaultRuneTranslations.json'
import {
  SESSION_STORAGE_DEBOUNCE_MS,
  TRANSLATION_SESSION_STORAGE_KEY,
} from '@/constants/persistence.js'

export const useRuneTranslationStore = defineStore('rune-translation', () => {
  const _mapRuneTranslations = (translations) =>
    Object.fromEntries(translations.map((data) => [String(data.id), data]))

  const loadRuneTranslations = (translations) => {
    outer.value = _mapRuneTranslations(structuredClone(translations.outerRunes))
    inner.value = _mapRuneTranslations(structuredClone(translations.innerRunes))
  }

  const outer = ref({})
  const inner = ref({})

  // Debounce timer for persistence
  let persistTimeout = null
  let isRestoring = false

  // Load defaults without triggering persistence
  isRestoring = true
  loadRuneTranslations(DEFAULT_RUNE_TRANSLATIONS)
  isRestoring = false

  const restoreFromSessionStorage = () => {
    const stored = sessionStorage.getItem(TRANSLATION_SESSION_STORAGE_KEY)
    if (!stored) {
      return
    }
    try {
      isRestoring = true
      const data = JSON.parse(stored)
      loadRuneTranslations(data)
      isRestoring = false
    } catch (e) {
      console.error('Failed to restore persisted translations:', e)
      isRestoring = false
    }
  }

  const persistToSessionStorage = () => {
    try {
      const data = {
        outerRunes: Object.values(outer.value),
        innerRunes: Object.values(inner.value),
      }
      sessionStorage.setItem(TRANSLATION_SESSION_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to persist translations:', e)
    }
  }

  // Debounced persist
  const debouncedPersistToSessionStorage = () => {
    if (isRestoring) return
    if (persistTimeout) clearTimeout(persistTimeout)
    persistTimeout = setTimeout(() => {
      persistToSessionStorage()
    }, SESSION_STORAGE_DEBOUNCE_MS)
  }

  // Watch for changes and persist
  watch(
    [outer, inner],
    () => {
      debouncedPersistToSessionStorage()
    },
    { deep: true },
  )

  return {
    outer,
    inner,
    loadRuneTranslations,
    restoreFromSessionStorage,
  }
})
