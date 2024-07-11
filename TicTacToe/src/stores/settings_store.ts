import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SettingsStorage } from "../types/settingsStorage"

export const useSettingsStore = defineStore('settings', () => {
    const numRows = ref(3)
    const numColumns = ref(3)
    const showSettings = ref(false)

    const initSettings = () :void => {
        const settings : SettingsStorage = JSON.parse(localStorage.getItem('settings') ?? '') || { rows: 3, columns: 3 }
        numRows.value = settings.rows
        numColumns.value = settings.columns
    }

    return {
        initSettings,
        numRows,
        numColumns,
        showSettings
    }
})