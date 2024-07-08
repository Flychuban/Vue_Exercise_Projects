<script setup>
import { ref, computed } from 'vue'
import { every } from 'lodash'

const {settings} = defineProps(['settings'])

const numRows = ref(settings.rows)
const numColumns = ref(settings.columns)

const board = ref([])
const currentPlayer = ref('')
const winningLine = ref(null)
const lineType = ref("")
initGame(numRows.value, numColumns.value)

function initGame(numRows, numColumns) {
    board.value = Array.from({ length: numRows }, () => Array.from({ length: numColumns }, () => ''))
    currentPlayer.value = 'X'
}

function clearBoard() {
    initGame(numRows.value, numColumns.value)
    winningLine.value = null

    console.log(board.value)
}

function timeout_func(custom_msg) {
    setTimeout(() => {
        alert(custom_msg)
        clearBoard()
    }, 1000);
}

const adjustCellsDimensions = computed(() => {
    return {
        width: `${80 / numColumns.value}vw`,
        height: `${80 / numRows.value}vh`
    }
})

// function checkWinner() {
//     // Check rows
//     for (let i = 0; i < 3; i++) {
//         if (board.value[i][0] === board.value[i][1] && board.value[i][1] === board.value[i][2] && board.value[i][0] !== '') {
//             return { player: board.value[i][0], line: [[i, 0], [i, 1], [i, 2]] }
//         }
//     }

//     // Check columns
//     for (let i = 0; i < 3; i++) {
//         if (board.value[0][i] === board.value[1][i] && board.value[1][i] === board.value[2][i] && board.value[0][i] !== '') {
//             return { player: board.value[0][i], line: [[0, i], [1, i], [2, i]] }
//         }
//     }

//     // Check diagonals
//     if (board.value[0][0] === board.value[1][1] && board.value[1][1] === board.value[2][2] && board.value[0][0] !== '') {
//         return { player: board.value[0][0], line: [[0, 0], [1, 1], [2, 2]] }
//     }

//     if (board.value[0][2] === board.value[1][1] && board.value[1][1] === board.value[2][0] && board.value[0][2] !== '') {
//         return { player: board.value[0][2], line: [[0, 2], [1, 1], [2, 0]] }
//     }

//     return null
// }

function checkWinner(board, numRows, numCols) {
    // Check rows
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j <= numCols - 3; j++) {
            if (board.value[i][j] === board.value[i][j + 1] &&
                board.value[i][j + 1] === board.value[i][j + 2] &&
                board.value[i][j] !== '') {
                return { player: board.value[i][j], line: [[i, j], [i, j + 1], [i, j + 2]] }
            }
        }
    }

    // Check columns
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 0; j < numCols; j++) {
            if (board.value[i][j] === board.value[i + 1][j] &&
                board.value[i + 1][j] === board.value[i + 2][j] &&
                board.value[i][j] !== '') {
                return { player: board.value[i][j], line: [[i, j], [i + 1, j], [i + 2, j]] }
            }
        }
    }

    // Check diagonals (top-left to bottom-right)
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 0; j <= numCols - 3; j++) {
            if (board.value[i][j] === board.value[i + 1][j + 1] &&
                board.value[i + 1][j + 1] === board.value[i + 2][j + 2] &&
                board.value[i][j] !== '') {
                return { player: board.value[i][j], line: [[i, j], [i + 1, j + 1], [i + 2, j + 2]] }
            }
        }
    }

    // Check diagonals (top-right to bottom-left)
    for (let i = 0; i <= numRows - 3; i++) {
        for (let j = 2; j < numCols; j++) {
            if (board.value[i][j] === board.value[i + 1][j - 1] &&
                board.value[i + 1][j - 1] === board.value[i + 2][j - 2] &&
                board.value[i][j] !== '') {
                return { player: board.value[i][j], line: [[i, j], [i + 1, j - 1], [i + 2, j - 2]] }
            }
        }
    }

    return null;
}




function checkBoardFull() {
    // Check if the board  values are not empty
    return every(board.value, row => every(row, cell => cell !== ''))
}

function handleClick(row, cell) {
    // In range start from 1 so we need to decrement by 1
    row--
    cell--

    if (board.value[row][cell] !== '')
        return

    board.value[row][cell] = currentPlayer.value
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

    console.log(row, cell)
    console.log(board.value)


    // Check if there is a winner after each move is put on the board template
    const winner = checkWinner(board, numRows.value, numColumns.value)
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

// const lineStyle = computed(() => {
//     if (!winningLine.value) return {}
//     const start = winningLine.value[0]
//     const end = winningLine.value[2]
//     const [startRow, startCol] = start
//     const [endRow, endCol] = end
//     const isRow = startRow === endRow // Check if the start and end row are the same
//     const isCol = startCol === endCol // Check if the start and end column are the same

//     console.log(startRow, startCol, endRow, endCol)
//     // Check if the line is diagonal from top-left to bottom-right
//     const isDiagonal = startRow === 0 && startCol === 0 && endRow === 2 && endCol === 2
//     // Check if the line is diagonal from top-right to bottom-left
//     const isAntiDiagonal = startRow === 0 && startCol === 2 && endRow === 2 && endCol === 0

//     const isDiagonal

//     if (isRow) {
//         lineType.value = "isRow"
//         return {
//             top: `${startRow * 33.3 + 16.5}%`,
//         }
//     } else if (isCol) {
//         lineType.value = "isCol"
//         return {
//             left: `${startCol * 33.3 + 16.5}%`,
//         }
//     }
//     else if (isDiagonal) {
//         lineType.value = "isDiagonal"
//         return {
//             transform: 'rotate(-45deg)'
//         }
//     }
//     else if (isAntiDiagonal) {
//         lineType.value = "isAntiDiagonal"
//         return {
//             transform: 'rotate(45deg)'
//         }
//     }
// })


const lineStyle = computed(() => {
    if (!winningLine.value) return {}
    const start = winningLine.value[0]
    const end = winningLine.value[2]
    const [startRow, startCol] = start
    const [endRow, endCol] = end
    const isRow = startRow === endRow // Check if the start and end row are the same
    const isCol = startCol === endCol // Check if the start and end column are the same

    console.log(startRow, startCol, endRow, endCol)

    // Check if the line is diagonal from top-left to bottom-right
    const isDiagonal = (endRow - startRow === endCol - startCol) && (startRow <= endRow) && (startCol <= endCol)

    // Check if the line is diagonal from top-right to bottom-left
    const isAntiDiagonal = (endRow - startRow === startCol - endCol) && (startRow <= endRow) && (startCol >= endCol)

    if (isRow) {
        lineType.value = "isRow"
        console.log(startRow * (100 / numRows.value) + (100 / (numRows.value * 2)))
        console.log(numRows.value, numColumns.value)
        return {
            top: `${startRow * (100 / numRows.value) + (100 / (numRows.value * 2))}%`,
            left: `${startCol * (100 / numColumns.value) + (100 / (numColumns.value * 2))}%`,
            width: `${(100 / numColumns.value) * 2}%`,
        }
    } else if (isCol) {
        lineType.value = "isCol"
        return {
            top: `${startRow * (100 / numRows.value) + (100 / (numRows.value * 2))}%`,
            left: `${startCol * (100 / numColumns.value) + (100 / (numColumns.value * 2))}%`,
            height: `${(100 / numRows.value) * 2}%`,
        }
    }
    else if (isDiagonal) {
        lineType.value = "isDiagonal"
        return {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotate(-45deg)',
            transformOrigin: 'top left'
        }
    }
    else if (isAntiDiagonal) {
        lineType.value = "isAntiDiagonal"
        return {
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            transform: 'rotate(45deg)',
            transformOrigin: 'top right'
        }
    }
})

</script>

<template>
    <div class="board-container">
        <div class="board">
            <div class="row" v-for="row in numRows" :key="row">
                <div class="cell" v-for="cell in numColumns" :key="cell" :style="adjustCellsDimensions" @click="handleClick(row, cell)">
                    <div class="cell-inner">
                        <!-- X - blue color -->
                        <!-- O - red color -->
                        <span class="cell-content" :style="{ color: board[row - 1][cell - 1] === 'X' ? 'blue' : 'red' }">{{
                            board[row - 1][cell - 1] }}</span>
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
}

.winner-line {
    position: absolute;
    background-color: yellow;
    z-index: 1;
}

.winner-line.isRow {
    height: 5px;
}

.winner-line.isCol {
    width: 5px;
}

.winner-line.isDiagonal {
    height: 100%;
    width: 5px;
    top: 0;
    left: 50%;
}

.winner-line.isAntiDiagonal {
    height: 100%;
    width: 5px;
    top: 0;
    left: 50%;
}
</style>