<script setup lang="ts">
import { ref, computed } from 'vue'
import { every } from 'lodash'
import { useSettingsStore } from '@/store/settings_store'
import { useBoardStore } from '@/store/board_store'
import type { CellDimensionsType } from '@/types/cellDimensionsType'
import type { LineStyleType } from '@/types/lineStyleType'
import { useRouter } from 'vue-router'

const settingsStore = useSettingsStore()
const boardStore = useBoardStore()

const router = useRouter()

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
    router.push('/settings')
}

function clearBoard(): void {
    initGame()
    winningLine.value = null
}

function timeout_func(custom_msg: string): void {
    setTimeout(() => {
        alert(custom_msg)
        clearBoard()
    }, 1000)
}

const adjustCellsDimensions = computed((): CellDimensionsType => {
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

    return null
}

function checkBoardFull(): boolean {
    // Check if the board values are not empty
    return every(boardStore.board, (row: string[]) => every(row, (cell: string) => cell !== ''))
}

function handleClick(row: number, cell: number): void {
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
        lineType.value = "row"
        return {
            top: `${(startRow * 100) / settingsStore.numRows}%`,
            left: '0',
            width: '100%',
            height: '2px'
        }
    } else if (isCol) {
        lineType.value = "col"
        return {
            top: '0',
            left: `${(startCol * 100) / settingsStore.numColumns}%`,
            width: '2px',
            height: '100%'
        }
    } else if (isDiagonal) {
        lineType.value = "diagonal"
        return {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            transform: 'rotate(45deg)',
            transformOrigin: 'top left'
        }
    } else if (isAntiDiagonal) {
        lineType.value = "antidiagonal"
        return {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            transform: 'rotate(-45deg)',
            transformOrigin: 'top right'
        }
    }
})
</script>

<template>
    <div>
        <div class="board"
            :style="{ gridTemplateRows: `repeat(${settingsStore.numRows}, 1fr)`, gridTemplateColumns: `repeat(${settingsStore.numColumns}, 1fr)` }">
            <div v-for="(row, rowIndex) in boardStore.board" :key="rowIndex">
                <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell" :style="adjustCellsDimensions"
                    @click="handleClick(rowIndex + 1, cellIndex + 1)">
                    {{ cell }}
                </div>
            </div>
            <div v-if="winningLine" class="line" :class="lineType" :style="lineStyle"></div>
        </div>
        <button @click="changeGameSettings">Change Game Settings</button>
        <button @click="clearBoard">Clear Board</button>
    </div>
</template>

<style scoped>
.board {
    display: grid;
    gap: 2px;
    width: 80vw;
    height: 80vw;
    background-color: black;
    margin-bottom: 20px;
}

.cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background-color: white;
    cursor: pointer;
}

button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.line {
    position: absolute;
    background-color: red;
}

.line.row {
    height: 2px;
}

.line.col {
    width: 2px;
}

.line.diagonal,
.line.antidiagonal {
    width: 2px;
    height: 2px;
    background-color: transparent;
    border-left: 2px solid red;
}
</style>