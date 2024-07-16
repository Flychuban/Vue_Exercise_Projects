import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingsStore } from '../store/settings_store'

export const useBoardStore = defineStore('board', () => {
  const settingsStore = useSettingsStore()

  const board = ref<string[][]>([])

  const initBoard = () => {
    board.value = Array.from({ length: settingsStore.numRows }, () => Array.from({ length: settingsStore.numColumns }, () => ''))
  }

  return {
    board,
    initBoard
  }
})