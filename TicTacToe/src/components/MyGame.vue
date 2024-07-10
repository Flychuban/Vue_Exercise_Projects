<script setup>
import { ref, computed } from 'vue'
import { every } from 'lodash'
import { useSettingsStore } from '../stores/settings_store'
import { useBoardStore } from '../stores/board_store'

const settingsStore = useSettingsStore()

const boardStore = useBoardStore()


// const board = ref([])
const currentPlayer = ref('')
const winningLine = ref(null)
const lineType = ref("")
initGame()

function initGame() {
    boardStore.initBoard(settingsStore.numRows, settingsStore.numColumns)
    currentPlayer.value = 'X'
}

function changeGameSettings() {
    settingsStore.showSettings = true
}

function clearBoard() {
    initGame(settingsStore.numRows, settingsStore.numColumns)
    winningLine.value = null
}

function timeout_func(custom_msg) {
    setTimeout(() => {
        alert(custom_msg)
        clearBoard()
    }, 1000);
}

const adjustCellsDimensions = computed(() => {
    if (settingsStore.numRows < settingsStore.numColumns)
        return {
            width: `${80 / settingsStore.numColumns}vw`,
            height: `${80 / settingsStore.numColumns}vw`
        }
    else
        return {
            width: `${80 / settingsStore.numRows}vw`,
            height: `${80 / settingsStore.numRows}vw`
        }
})


function checkWinner(numRows, numCols) {
    // Check rows
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j <= numCols - 3; j++) {
            if (boardStore.board[i][j] === boardStore.board[i][j + 1] &&
                boardStore.board[i][j + 1] === boardStore.board[i][j + 2] &&
                boardStore.board[i][j] !== '') {
                return { player: boardStore.board[i][j], line: [[i, j], [i, j + 1], [i, j + 2]] }
            }
        }
    }

    // Check columns
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 0; j < numCols; j++) {
            if (boardStore.board[i][j] === boardStore.board[i + 1][j] &&
                boardStore.board[i + 1][j] === boardStore.board[i + 2][j] &&
                boardStore.board[i][j] !== '') {
                return { player: boardStore.board[i][j], line: [[i, j], [i + 1, j], [i + 2, j]] }
            }
        }
    }

    // Check diagonals (top-left to bottom-right)
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 0; j <= numCols - 3; j++) {
            if (boardStore.board[i][j] === boardStore.board[i + 1][j + 1] &&
                boardStore.board[i + 1][j + 1] === boardStore.board[i + 2][j + 2] &&
                boardStore.board[i][j] !== '') {
                return { player: boardStore.board[i][j], line: [[i, j], [i + 1, j + 1], [i + 2, j + 2]] }
            }
        }
    }

    // Check diagonals (top-right to bottom-left)
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 2; j < numCols; j++) {
            if (boardStore.board[i][j] === boardStore.board[i + 1][j - 1] &&
                boardStore.board[i + 1][j - 1] === boardStore.board[i + 2][j - 2] &&
                boardStore.board[i][j] !== '') {
                return { player: boardStore.board[i][j], line: [[i, j], [i + 1, j - 1], [i + 2, j - 2]] }
            }
        }
    }

    return null;
}



function checkBoardFull() {
    // Check if the board  values are not empty
    return every(boardStore.board, row => every(row, cell => cell !== ''))
}

function handleClick(row, cell) {
    // In range start from 1 so we need to decrement by 1
    row--
    cell--

    if (boardStore.board[row][cell] !== '')
        return

    boardStore.board[row][cell] = currentPlayer.value
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

    // Check if there is a winner after each move is put on the board template
    const winner = checkWinner(settingsStore.numRows, settingsStore.numColumns)
    if (winner) {
        winningLine.value = winner.line
        timeout_func(`Player ${winner.player} wins!`)
        return
    }

    // Check if the board is full
    const isFull = checkBoardFull()
    if (isFull) {
        timeout_func('It is a draw!')
    }
}


const lineStyle = computed(() => {
    if (!winningLine.value) return {}
    const start = winningLine.value[0]
    const end = winningLine.value[2]
    const [startRow, startCol] = start
    const [endRow, endCol] = end
    const isRow = startRow === endRow // Check if the start and end row are the same
    const isCol = startCol === endCol // Check if the start and end column are the same


    // Check if the line is diagonal from top-left to bottom-right
    const isDiagonal = (endRow - startRow === endCol - startCol) && (startRow <= endRow) && (startCol <= endCol)

    // Check if the line is diagonal from top-right to bottom-left
    const isAntiDiagonal = (endRow - startRow === startCol - endCol) && (startRow <= endRow) && (startCol >= endCol)

    if (isRow) {
        lineType.value = "isRow"
        return {
            top: `${startRow * (100 / settingsStore.numRows) + (100 / (settingsStore.numRows * 2))}%`,
            left: `${startCol * (100 / settingsStore.numColumns) + (100 / (settingsStore.numColumns * 2))}%`,
            width: `${(100 / settingsStore.numColumns) * 2}%`,
        }
    } else if (isCol) {
        lineType.value = "isCol"
        return {
            top: `${startRow * (100 / settingsStore.numRows) + (100 / (settingsStore.numRows * 2))}%`,
            left: `${startCol * (100 / settingsStore.numColumns) + (100 / (settingsStore.numColumns * 2))}%`,
            height: `${(100 / settingsStore.numRows) * 2}%`,
        }
    }
    else if (isDiagonal) {
        lineType.value = "isDiagonal"
        return {
            top: `${startRow * (100 / settingsStore.numRows)}%`,
            left: `${startCol * (100 / settingsStore.numColumns) + (100 / settingsStore.numColumns) * 1.5}%`,
            height: `${(100 / settingsStore.numRows) * 3}%`,
        }
    }
    else if (isAntiDiagonal) {
        lineType.value = "isAntiDiagonal"
        return {
            top: `${startRow * (100 / settingsStore.numRows)}%`,
            left: `${startCol * (100 / settingsStore.numColumns) - (100 / settingsStore.numColumns) / 2}%`,
            height: `${(100 / settingsStore.numRows) * 3}%`,
        }
    }
})

</script>

<template>
    <button class="settings-button" @click="changeGameSettings">GO TO GameSettings</button>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in settingsStore.numRows" :key="row">
                <div class="cell" v-for="cell in settingsStore.numColumns" :key="cell" :style="adjustCellsDimensions" @click="handleClick(row, cell)">
                    <div class="cell-inner">
                        <!-- X - blue color -->
                        <!-- O - red color -->
                        <span class="cell-content" :style="{ color: boardStore.board[row - 1][cell - 1] === 'X' ? 'blue' : 'red' }">{{
                            boardStore.board[row - 1][cell - 1] }}</span>
                    </div>
                </div>
            </div>
            <div v-if="winningLine" class="winner-line" :style="lineStyle" :class="lineType"></div>
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
.settings-button {
    margin-bottom: 20px;
    padding: 10px 20px;
    font-size: 1.5rem;
    background-color: #000;
    color: azure;
}

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
    background-color: #000;
    color: azure;
}

.winner-line {
    position: absolute;
    background-color: yellow;
    z-index: 1;
}

.winner-line.isRow {
    height: 10px;
}

.winner-line.isCol {
    width: 10px;
}

.winner-line.isDiagonal {
    width: 10px;
    transform: rotate(-45deg);
}

.winner-line.isAntiDiagonal {
    width: 10px;
    transform: rotate(45deg);
}
</style>