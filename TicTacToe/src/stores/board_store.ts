import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingsStore } from './settings_store'
import { BoardState } from '../types/boardState'

export const useBoardStore = defineStore('board_state', () => {
    const settingsStore = useSettingsStore()
    
    const board = ref<BoardState['board']>([])


    const initBoard = () : void => {
        board.value = Array.from({ length: settingsStore.numRows }, () => Array.from({ length: settingsStore.numColumns }, () => ''))
    }

    return {
        board,
        initBoard
    }
})
