<!-- Basic form for number of rows and columns that will be in the Tic Tac Toe -->
<script setup>
import { ref, onBeforeMount} from 'vue'

const emit = defineEmits(['change-settings'])

const numRows = ref(3)
const numColumns = ref(3)

function submitSettings() {
    console.log(numRows.value, numColumns.value)
    // Emit an event to the parent component with the number of rows and columns
    emit('change-settings', { rows: numRows.value, columns: numColumns.value })
}


onBeforeMount(() => {
    if(localStorage.getItem('settings')) {
        const settings = JSON.parse(localStorage.getItem('settings'))
        numRows.value = settings.rows
        numColumns.value = settings.columns
    }
})

</script>


<template>
    <div class="form-container">
        <form @submit.prevent="submitSettings">
            <h2>Write down Tic Tac Toe Board dimensions</h2>
            <div class="form-inputs">
                <label for="rows">Rows:</label>
                <input type="number" id="rows" v-model="numRows" value="3" min="3" max="20" required>
                <label for="columns">Columns:</label>
                <input type="number" id="columns" v-model="numColumns" value="3" min="3" max="20" required>
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