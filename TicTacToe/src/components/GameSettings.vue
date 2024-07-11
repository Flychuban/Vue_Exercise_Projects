<!-- Basic form for number of rows and columns that will be in the Tic Tac Toe -->
<script setup lang="ts">
import { onBeforeMount} from 'vue'
import { useSettingsStore } from '../stores/settings_store'

const settingsStore = useSettingsStore()

onBeforeMount(() :void => {
    if(!localStorage.getItem('settings')) return
    settingsStore.initSettings()
})

function saveSettings() :void {
    localStorage.setItem('settings', JSON.stringify({
        rows: settingsStore.numRows,
        columns: settingsStore.numColumns
    }))
    settingsStore.showSettings = false
} 

</script>


<template>
    <div class="form-container">
        <form @submit.prevent="saveSettings">
            <h2>Write down Tic Tac Toe Board dimensions</h2>
            <div class="form-inputs">
                <label for="rows">Rows:</label>
                <input type="number" id="rows" 
                v-model="settingsStore.numRows" 
                @input="settingsStore.numRows = parseInt(($event.target as HTMLInputElement).value)"
                min="3" max="20" required>
                <label for="columns">Columns:</label>
                <input type="number" id="columns" 
                    v-model="settingsStore.numColumns" 
                    @input="settingsStore.numColumns = parseInt(($event.target as HTMLInputElement).value)"
                    min="3" max="20" required>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h2 {
    font-size: 2rem;
}

.form-inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

label {
    font-size: 1.5rem;
    margin-right: -0.5rem;
}

input {
    font-size: 1.5rem;
    width: 4rem;
    text-align: center;
}

button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

</style>