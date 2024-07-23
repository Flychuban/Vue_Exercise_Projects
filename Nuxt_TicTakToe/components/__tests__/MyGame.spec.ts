import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MyGame from '../MyGame.vue'
import { useSettingsStore } from '../../store/settings_store'
import { useBoardStore } from '../../store/board_store'
import { useRouter } from 'vue-router'

describe('MyGame.vue', () => {
  let wrapper: any

  beforeEach(() => {
    setActivePinia(createPinia())


    const settingsStore = useSettingsStore()
    const boardStore = useBoardStore()

    // Mock initial state
    settingsStore.numRows = 3
    settingsStore.numColumns = 3
    settingsStore.player1_name = 'Gosho'
    settingsStore.player2_name = 'Pesho'

    boardStore.initBoard()

    wrapper = mount(MyGame, {
      global: {
        plugins: [createPinia()],
      },
    })
  })

  it('renders the game board correctly', () => {
    expect(wrapper.findAll('.row').length).toBe(3)
    expect(wrapper.findAll('.cell').length).toBe(9)
  })

  it('initializes the game correctly', () => {
    const boardStore = useBoardStore()
    expect(boardStore.board.length).toBe(3)
    expect(boardStore.board[0].length).toBe(3)
    expect(wrapper.vm.currentPlayer).toBe('X')
  })

  it('handles cell click correctly', async () => {
    const firstCell = wrapper.findAll('.cell').at(0)
    await firstCell.trigger('click')
    expect(firstCell.text()).toBe('X')
    expect(wrapper.vm.currentPlayer).toBe('O')
  })

  it('restars the game correctly', async () => {
    const firstCell = wrapper.findAll('.cell').at(0)
    await firstCell.trigger('click')
    expect(firstCell.text()).toBe('X')
    expect(wrapper.vm.currentPlayer).toBe('O')

    await wrapper.vm.clearBoard()
    expect(wrapper.vm.currentPlayer).toBe('X')
    expect(wrapper.vm.winningLine).toBe(null)
  })

  it('detects a draw correctly', async () => {
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X']
    ]

    await wrapper.vm.checkBoardFull()
    expect(wrapper.vm.winningLine).toBe(null)
    expect(wrapper.vm.currentPlayer).toBe('X')
    })

  it('updates cell dimensions based on settings', () => {
    const settingsStore = useSettingsStore()
    settingsStore.numRows = 4
    settingsStore.numColumns = 5

    const adjustCellsDimensions = wrapper.vm.adjustCellsDimensions
    expect(adjustCellsDimensions.width).toBe('16vw')
    expect(adjustCellsDimensions.height).toBe('16vw')

    settingsStore.numRows = 5
    settingsStore.numColumns = 4

    const newAdjustCellsDimensions = wrapper.vm.adjustCellsDimensions
    expect(newAdjustCellsDimensions.width).toBe('16vw')
    expect(newAdjustCellsDimensions.height).toBe('16vw')
  })

  it('calls timeout_func with winner message', async () => {
    const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'X', 'X'],
      ['', '', ''],
      ['', '', '']
    ]

    await wrapper.vm.handleClick(1, 3)
    expect(timeoutSpy).toHaveBeenCalledWith('Gosho wins!')
  })

  it('detects a winner correctly', async () => {
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'X', 'X'],
      ['O', 'O', ''],
      ['', '', '']
    ]

    const result = wrapper.vm.checkWinner()
    expect(result).toEqual({ player: 'X', line: [[0, 0], [0, 1], [0, 2]] });
  })

    it('changes game settings and navigates to settings page', async () => {
    const router = useRouter()
    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.vm.changeGameSettings()
    expect(pushSpy).toHaveBeenCalledWith('/settings')
    })


//   it('calls timeout_func with winner message', async () => {
//     const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
//     const boardStore = useBoardStore()
//     boardStore.board = [
//       ['X', 'X', 'X'],
//       ['', '', ''],
//       ['', '', '']
//     ]

//     await wrapper.vm.handleClick(1, 3)
//     expect(timeoutSpy).toHaveBeenCalledWith('Player 1 wins!')
//   })
})