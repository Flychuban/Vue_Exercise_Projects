import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MyGame from '../MyGame.vue'
import { useSettingsStore } from '../../store/settings_store'
import { useBoardStore } from '../../store/board_store'

describe('MyGame.vue', () => {
  let wrapper: any

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingsStore = useSettingsStore()
    const boardStore = useBoardStore()

    // Mock initial state
    settingsStore.numRows = 3
    settingsStore.numColumns = 3
    settingsStore.player1_name = 'Player 1'
    settingsStore.player2_name = 'Player 2'

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

//   it('detects a winner correctly', async () => {
//     const boardStore = useBoardStore()
//     boardStore.board = [
//       ['X', 'X', 'X'],
//       ['', '', ''],
//       ['', '', '']
//     ]

//     await wrapper.vm.checkWinner(3, 3)
//     expect(wrapper.vm.winningLine).toEqual([[0, 0], [0, 1], [0, 2]])
//   })

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