import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const numRows = ref<number>(3)
  const numColumns = ref<number>(3)
  const showSettings = ref<boolean>(false)

  const initSettings = () => {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    numRows.value = settings.rows || 3
    numColumns.value = settings.columns || 3
  }

  return {
    numRows,
    numColumns,
    showSettings,
    initSettings
  }
})