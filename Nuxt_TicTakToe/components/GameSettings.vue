<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useSettingsStore } from '../store/settings_store'
import { useRouter } from 'vue-router'

const settingsStore = useSettingsStore()
const router = useRouter()

const rowErrorMessage = ref<string>('')
const columnErrorMessage = ref<string>('')

onBeforeMount((): void => {
    if (!localStorage.getItem('settings')) return
    settingsStore.initSettings()
})

function validateRows() {
    const value = settingsStore.numRows
    if (value <= 3) {
        rowErrorMessage.value = 'Rows cannot be less than 3.'
    } else if (value >= 20) {
        rowErrorMessage.value = 'Rows cannot be more than 20.'
    } else {
        rowErrorMessage.value = ''
    }
}

function validateColumns() {
    const value = settingsStore.numColumns
    if (value <= 3) {
        columnErrorMessage.value = 'Columns cannot be less than 3.'
    } else if (value >= 20) {
        columnErrorMessage.value = 'Columns cannot be more than 20.'
    } else {
        columnErrorMessage.value = ''
    }
}


function saveSettings(): void {
    if (rowErrorMessage.value || columnErrorMessage.value) return
    localStorage.setItem('settings', JSON.stringify({
        rows: settingsStore.numRows,
        columns: settingsStore.numColumns,
        player1_name: settingsStore.player1_name,
        player2_name: settingsStore.player2_name

    }))
    settingsStore.showSettings = false
    router.push('/game') // Navigate to the game page
}
</script>

<template>
    <h1>Tic Tak Toe</h1>
    <div class="form-container">
        <form @submit.prevent="saveSettings">
            <h2>Write down Tic Tac Toe Board dimensions</h2>
            <div class="form-inputs">
                <label for="rows">Rows:</label>
                <input type="number" id="rows" v-model="settingsStore.numRows"
                    @input="validateRows" min="3" max="20"
                    required>
                <span v-if="rowErrorMessage" class="error-message-rows">{{ rowErrorMessage }}</span>
                <label for="columns">Columns:</label>
                <input type="number" id="columns" v-model="settingsStore.numColumns"
                    @input="validateColumns" min="3" max="20"
                    required>
                <span v-if="columnErrorMessage" class="error-message-columns">{{ columnErrorMessage }}</span>
                <br>
                <label for="player1_name">Player X Name:</label>
                <input class="name-input" type="text" id="player1_name" v-model="settingsStore.player1_name"
                    required>
                <br>
                <label for="player2_name">Player O Name:</label>
                <input class="name-input" type="text" id="player2_name" v-model="settingsStore.player2_name"
                    required>
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

h1 {
    font-size: 4rem;
    margin-bottom: 7.5vh;
}

h2 {
    margin-left: 10vw;
    font-size: 3rem;
}

.form-inputs {
    width: 60vw;
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

.name-input {
    width: 10rem;
    text-align: center;
    font-size: 1.25rem;
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

.error-message-rows {
    position: absolute;
    color: red;
    font-size: 1.25em;
    transform: translate(-27vw, 5vh);
}

.error-message-columns {
    position: absolute;
    color: red;
    font-size: 1.25em;
    transform: translate(-12vw, 5vh);
}
</style>
