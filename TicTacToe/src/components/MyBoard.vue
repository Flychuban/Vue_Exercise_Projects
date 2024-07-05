
<!-- Export default this component -->
<script setup>
import { ref } from 'vue'
const board = ref([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
])

const currentPlayer = ref('X')

function clearBoard() {
    board.value = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
    currentPlayer.value = 'X'
}

function handleClick(row, cell) {
    if (board.value[row][cell] === '') {
        board.value[row][cell] = currentPlayer.value
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    }
}

</script>

<template>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in 3" :key="row">
                <div class="cell" v-for="cell in 3" :key="cell">
                    <div class="cell-inner" @click="handleClick(row, cell)">
                        <span class="cell-content"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="status">
            <div class="status-inner">
                <span class="status-content">Next player: {{ currentPlayer }}</span>
            </div>
        </div>
        <div class="restart">
            <button class="restart-button" @click="clearBoard()">Restart</button>
        </div>
    </div>
</template>

<style>
.board-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
}

.board {
    margin-top: 7.5vh;
    margin-bottom: 2.5vh;
    display: flex;
    flex-direction: column;
    border: 1px solid #000;
}

.row {
    display: flex;
}

.cell {
    width: 15vh;
    height: 15vh;
    border: 3px solid #000;
}

.cell-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.cell-content {
    font-size: 2rem;
}

.status {
    margin-top: 20px;
}

.status-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 50px;
    border: 1px solid #000;
}

.status-content {
    font-size: 1.5rem;
}

.restart {
    margin-top: 20px;
}

.restart-button {
    padding: 10px 20px;
    font-size: 1.5rem;
}
</style>