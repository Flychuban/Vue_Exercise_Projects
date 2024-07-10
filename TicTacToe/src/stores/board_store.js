import { defineStore } from 'pinia'
import {ref, computed} from 'vue'
import { useSettingsStore } from './settings_store'


export const useBoardStore = defineStore('board_state', () => {
    const board = ref([])
    const currentPlayer = ref('')

    const settingsStore = useSettingsStore()

    const initBoard = () => {
        board.value = Array.from({ length: settingsStore.numRows }, () => Array.from({ length: settingsStore.numColumns }, () => ''))
    }

    return {
        board,
        currentPlayer,
        initBoard
    }
})
