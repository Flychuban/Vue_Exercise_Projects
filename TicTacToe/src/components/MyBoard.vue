
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

    console.log(board.value)
}

function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board.value[i][0] === board.value[i][1] && board.value[i][1] === board.value[i][2] && board.value[i][0] !== '') {
            return board.value[i][0]
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board.value[0][i] === board.value[1][i] && board.value[1][i] === board.value[2][i] && board.value[0][i] !== '') {
            return board.value[0][i]
        }
    }

    // Check diagonals
    if (board.value[0][0] === board.value[1][1] && board.value[1][1] === board.value[2][2] && board.value[0][0] !== '') {
        return board.value[0][0]
    }

    if (board.value[0][2] === board.value[1][1] && board.value[1][1] === board.value[2][0] && board.value[0][2] !== '') {
        return board.value[0][2]
    }

    return null
}

function checkBoardFull() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.value[i][j] === '') {
                return false
            }
        }
    }

    return true
}

function handleClick(row, cell) {
    // In range start from 1 so we need to decrement by 1
    row--
    cell--

    if (board.value[row][cell] === '') {
        board.value[row][cell] = currentPlayer.value
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

        console.log(row, cell)
        console.log(board.value)
    }

    // Check if there is a winner
    const winner = checkWinner()
    if (winner) {
        alert(`Player ${winner} wins!`)
        clearBoard()
    }

    // Check if the board is full
    if (checkBoardFull()) {
        alert('The game is a draw!')
        clearBoard()
    }
}

</script>

<template>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in 3" :key="row">
                <div class="cell" v-for="cell in 3" :key="cell" @click="handleClick(row, cell)">
                    <div class="cell-inner">
                        <span class="cell-content">{{ board[row-1][cell-1] }}</span>
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
    font-size: 4rem;
    font-weight: bold;
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