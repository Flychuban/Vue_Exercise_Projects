<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '../store/settings_store'
import { useBoardStore } from '../store/board_store'
import type { CellDimensionsType } from '../types/cellDimensionsType'
import type { LineStyleType } from '../types/lineStyleType'
import { useRouter } from 'vue-router'
import { every } from 'lodash'


const settingsStore = useSettingsStore()
const boardStore = useBoardStore()

const router = useRouter()


// const board = ref([])
const currentPlayer = ref<string>('')
const winningLine = ref<[number, number][] | null>(null)
const lineType = ref<string>("")
initGame()

function initGame(): void {
    boardStore.initBoard()
    currentPlayer.value = 'X'
}

function changeGameSettings(): void {
    settingsStore.showSettings = true
    router.push('/settings'); // Navigate to the settings page
}

function clearBoard(): void {
    initGame()
    winningLine.value = null
}

function timeout_func(custom_msg: string): void {
    setTimeout(() => {
        alert(custom_msg)
        clearBoard()
    }, 1000);
}

const adjustCellsDimensions = computed((): CellDimensionsType => {
    if (settingsStore.numRows < settingsStore.numColumns)
        return {
            width: <string>`${80 / settingsStore.numColumns}vw`,
            height: <string>`${80 / settingsStore.numColumns}vw`
        }
    else
        return {
            width: <string>`${80 / settingsStore.numRows}vw`,
            height: <string>`${80 / settingsStore.numRows}vw`
        }
})


function checkWinner(numRows: number, numCols: number): { player: string, line: [number, number][] } | null {
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




function checkBoardFull(): boolean {
    // Check if the board  values are not empty
    return every(boardStore.board, (row: string[]) => every(row, (cell: string) => cell !== ''))
}

function handleClick(row: number, cell: number): void {
    // In range start from 1 so we need to decrement by 1
    row--
    cell--
    console.log(boardStore.board[row][cell])
    if (boardStore.board[row][cell] !== '')
        return

    boardStore.board[row][cell] = currentPlayer.value
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

    // Check if there is a winner after each move is put on the board template
    const winner = checkWinner(settingsStore.numRows, settingsStore.numColumns)
    console.log(winner)
    if (winner) {
        winningLine.value = winner.line
        console.log(timeout_func)
        timeout_func(`${winner.player === "X" ? settingsStore.player1_name : settingsStore.player2_name} wins!`)
        return
    }

    // Check if the board is full
    const isFull = checkBoardFull()
    if (isFull) {
        timeout_func('It is a draw!')
    }
}


const lineStyle = computed((): LineStyleType | undefined => {
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
            top: <string>`${startRow * (100 / settingsStore.numRows) + (100 / (settingsStore.numRows * 2))}%`,
            left: <string>`${startCol * (100 / settingsStore.numColumns) + (100 / (settingsStore.numColumns * 2))}%`,
            width: <string>`${(100 / settingsStore.numColumns) * 2}%`,
        }
    } else if (isCol) {
        lineType.value = "isCol"
        return {
            top: <string>`${startRow * (100 / settingsStore.numRows) + (100 / (settingsStore.numRows * 2))}%`,
            left: <string>`${startCol * (100 / settingsStore.numColumns) + (100 / (settingsStore.numColumns * 2))}%`,
            height: <string>`${(100 / settingsStore.numRows) * 2}%`,
        }
    }
    else if (isDiagonal) {
        lineType.value = "isDiagonal"
        return {
            top: <string>`${startRow * (100 / settingsStore.numRows)}%`,
            left: <string>`${startCol * (100 / settingsStore.numColumns) + (100 / settingsStore.numColumns) * 1.5}%`,
            height: <string>`${(100 / settingsStore.numRows) * 3}%`,
        }
    }
    else if (isAntiDiagonal) {
        lineType.value = "isAntiDiagonal"
        return {
            top: <string>`${startRow * (100 / settingsStore.numRows)}%`,
            left: <string>`${startCol * (100 / settingsStore.numColumns) - (100 / settingsStore.numColumns) / 2}%`,
            height: <string>`${(100 / settingsStore.numRows) * 3}%`,
        }
    }
})

</script>

<template>
<h1>Tic Tak Toe</h1>
    <button class="settings-button" @click="changeGameSettings">GO TO GameSettings</button>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in settingsStore.numRows" :key="row">
                <div class="cell" v-for="cell in settingsStore.numColumns" :key="cell" :style="adjustCellsDimensions"
                    @click="handleClick(row, cell)">
                    <div class="cell-inner">
                        <!-- X - blue color -->
                        <!-- O - red color -->
                         <span class="cell-content"
                            :style="{ color: boardStore.board[row - 1] && boardStore.board[row - 1][cell - 1] === 'X' ? 'blue' : 'red' }">
                            {{ boardStore.board[row - 1] ? boardStore.board[row - 1][cell - 1] : '' }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="winningLine" class="winner-line" :style="lineStyle || {}" :class="lineType || ''"></div>
        </div>
        <div class="status">
            <div class="status-inner">
                <span class="status-content">Next player: {{ currentPlayer === 'X' ? settingsStore.player1_name : settingsStore.player2_name }}</span>
            </div>
        </div>
        <div class="restart">
            <button class="restart-button" @click="clearBoard()">Restart</button>
        </div>
    </div>
</template>

<style>

h1 {
    font-size: 4rem;
    margin-bottom: 7.5vh;
}

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
}</style>