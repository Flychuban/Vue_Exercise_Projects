import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingsStore } from './settings_store'


export const useBoardStore = defineStore('board_state', () => {
    const settingsStore = useSettingsStore()
    
    const board = ref([])


    const initBoard = () => {
        board.value = Array.from({ length: settingsStore.numRows }, () => Array.from({ length: settingsStore.numColumns }, () => ''))
    }

    return {
        board,
        initBoard
    }
})
