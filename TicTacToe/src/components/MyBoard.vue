<script setup>
import { ref, computed } from 'vue'

const board = ref([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
])

const currentPlayer = ref('X')
const winningLine = ref(null)

function clearBoard() {
    board.value = [
        ['', '', ''],
        ['', '', '']
    ]
    currentPlayer.value = 'X'
    winningLine.value = null

    console.log(board.value)
}

function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board.value[i][0] === board.value[i][1] && board.value[i][1] === board.value[i][2] && board.value[i][0] !== '') {
            return { player: board.value[i][0], line: [[i, 0], [i, 1], [i, 2]] }
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board.value[0][i] === board.value[1][i] && board.value[1][i] === board.value[2][i] && board.value[0][i] !== '') {
            return { player: board.value[0][i], line: [[0, i], [1, i], [2, i]] }
        }
    }

    // Check diagonals
    if (board.value[0][0] === board.value[1][1] && board.value[1][1] === board.value[2][2] && board.value[0][0] !== '') {
        return { player: board.value[0][0], line: [[0, 0], [1, 1], [2, 2]] }
    }

    if (board.value[0][2] === board.value[1][1] && board.value[1][1] === board.value[2][0] && board.value[0][2] !== '') {
        return { player: board.value[0][2], line: [[0, 2], [1, 1], [2, 0]] }
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

    // Check if there is a winner after each move is put on the board template
    const winner = checkWinner()
    if (winner) {
        winningLine.value = winner.line
        setTimeout(() => {
            alert(`Player ${winner.player} wins!`)
            clearBoard()
        }, 1000);
    }

    // Check if the board is full
    const isFull = checkBoardFull()
    if (isFull && !winner) {
        setTimeout(() => {
            alert('The game is a draw!')
            clearBoard()
        }, 1000);
    }
}

const lineStyle = computed(() => {
    if (!winningLine.value) return {}
    const start= winningLine.value[0]
    const end = winningLine.value[2]
    const [startRow, startCol] = start
    const [endRow, endCol] = end
    const isRow = startRow === endRow // Check if the start and end row are the same
    const isCol = startCol === endCol // Check if the start and end column are the same

    console.log(startRow, startCol, endRow, endCol)
    // Check if the line is diagonal from top-left to bottom-right
    const isDiagonal = startRow === 0 && startCol === 0 && endRow === 2 && endCol === 2
    // Check if the line is diagonal from top-right to bottom-left
    const isAntiDiagonal = startRow === 0 && startCol === 2 && endRow === 2 && endCol === 0

    if (isRow) {
        return {
            top: `${startRow * 33.3 + 16.5}%`,
            left: '0',
            transform: 'none',
            width: '100%',
            height: '5px'
        }
    } else if (isCol) {
        return {
            top: '0',
            left: `${startCol * 33.3 + 16.5}%`,
            width: '5px',
            height: '100%',
        }
    }
    else if (isDiagonal) {
        return {
            top: '0',
            left: '50%',
            height: '100%',
            width: '5px',
            transform: 'rotate(-45deg)'
        }
    }
    else if (isAntiDiagonal) {
        return {
            top: '0',
            right: `50%`,
            height: '100%',
            width: '5px',
            transform: 'rotate(45deg)'
        }
    }
})
</script>

<template>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in 3" :key="row">
                <div class="cell" v-for="cell in 3" :key="cell" @click="handleClick(row, cell)">
                    <div class="cell-inner">
                        <!-- X - blue color -->
                        <!-- O - red color -->
                        <span class="cell-content" :style="{ color: board[row - 1][cell - 1] === 'X' ? 'blue' : 'red' }">{{
                            board[row - 1][cell - 1] }}</span>
                    </div>
                </div>
            </div>
            <div v-if="winningLine" class="winner-line" :style="lineStyle"></div>
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
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #000;
}

.row {
    display: flex;
}

.cell {
    width: 13vw;
    height: 13vw;
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
    margin-top: 3vh;
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

.winner-line {
    position: absolute;
    background-color: yellow;
    height: 5px;
    z-index: 1;
}
</style>