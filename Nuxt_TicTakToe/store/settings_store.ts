import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SettingsStorage } from "../types/settingsStorage"

export const useSettingsStore = defineStore('settings', () => {
    const numRows = ref<number>(3)
    const numColumns = ref<number>(3)
    const player1_name = ref<string>('Player 1')
    const player2_name = ref<string>('Player 2')
    const showSettings = ref<boolean>(false)

    const initSettings = () :void => {
        const settings : SettingsStorage = JSON.parse(localStorage.getItem('settings') ?? '') || { rows: 3, columns: 3, player1_name: 'Player 1', player2_name: 'Player 2' }
        numRows.value = settings.rows
        numColumns.value = settings.columns
        player1_name.value = settings.player1_name
        player2_name.value = settings.player2_name
    }

    return {
        initSettings,
        numRows,
        numColumns,
        player1_name,
        player2_name,
        showSettings
    }
})
