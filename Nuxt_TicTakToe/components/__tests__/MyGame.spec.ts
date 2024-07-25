import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MyGame from '../MyGame.vue'
import { useSettingsStore } from '../../store/settings_store'
import { useBoardStore } from '../../store/board_store'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

describe('MyGame.vue', () => {
  let wrapper: any
  let mockRouter: any
  
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

    mockRouter = createRouter({
      history: createWebHistory(),
      routes: [], // You can add routes if needed for specific tests
    });


    wrapper = mount(MyGame, {
      global: {
        plugins: [mockRouter],
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

    const boardStore = useBoardStore()
    expect(boardStore.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ])
  })

  it('detects a draw correctly', async () => {
    const boardStore = useBoardStore()

    const alertMock = vi.fn()
    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(alertMock)

    boardStore.board = [
      ['X', 'O', ''],
      ['X', 'O', 'O'],
      ['O', 'X', 'X']
    ]
    vi.useFakeTimers()

    await wrapper.vm.handleClick(1, 3)

    vi.runAllTimers()

    expect(wrapper.vm.winningLine).toBe(null)
    expect(wrapper.vm.currentPlayer).toBe('X')
    expect(alertSpy).toHaveBeenCalledWith('It is a draw!')
    
    vi.useRealTimers()
    vi.restoreAllMocks()
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

  it('calls timeout_func with winner message for player1', async () => {
    // Mock the global alert function
    const alertMock = vi.fn()

    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(alertMock)
    // const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'X', ''],
      ['', '', ''],
      ['', '', '']
    ]

    // Mock setTimeout
    vi.useFakeTimers()

    await wrapper.vm.handleClick(1, 3)

    // Fast-forward until all timers have been executed
    vi.runAllTimers()

    // expect(timeoutSpy).toHaveBeenCalledWith('Gosho wins!')
    expect(alertSpy).toHaveBeenCalledWith('Gosho wins!')

    // Restore the original timers and alert function after the test
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

    it('calls timeout_func with winner message for player2', async () => {
    // Mock the global alert function
    const alertMock = vi.fn()

    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(alertMock)
    // const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
    const boardStore = useBoardStore()
    boardStore.board = [
      ['O', '', ''],
      ['O', '', ''],
      ['', '', '']
    ]

    // Mock setTimeout
    vi.useFakeTimers()

    await wrapper.vm.handleClick(3, 2)
    await wrapper.vm.handleClick(3, 1)

    // Fast-forward until all timers have been executed
    vi.runAllTimers()

    expect(alertSpy).toHaveBeenCalledWith('Pesho wins!')

    // Restore the original timers and alert function after the test
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('calls timeout_func with winner message for player1 diagonally', async () => {
    // Mock the global alert function
    const alertMock = vi.fn()

    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(alertMock)
    // const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', '', ''],
      ['', 'X', ''],
      ['', '', '']
    ]

    // Mock setTimeout
    vi.useFakeTimers()

    await wrapper.vm.handleClick(3, 3)

    // Fast-forward until all timers have been executed
    vi.runAllTimers()

    expect(alertSpy).toHaveBeenCalledWith('Gosho wins!')

    // Restore the original timers and alert function after the test
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('calls timeout_func with winner message for player2', async () => {
    // Mock the global alert function
    const alertMock = vi.fn()

    const alertSpy = vi.spyOn(global, 'alert').mockImplementation(alertMock)
    // const timeoutSpy = vi.spyOn(wrapper.vm, 'timeout_func')
    const boardStore = useBoardStore()
    boardStore.board = [
      ['', '', 'O'],
      ['', 'O', ''],
      ['', '', '']
    ]

    // Mock setTimeout
    vi.useFakeTimers()

    await wrapper.vm.handleClick(3, 2)
    await wrapper.vm.handleClick(3, 1)

    // Fast-forward until all timers have been executed
    vi.runAllTimers()

    expect(alertSpy).toHaveBeenCalledWith('Pesho wins!')

    // Restore the original timers and alert function after the test
    vi.useRealTimers()
    vi.restoreAllMocks()
  })



  it('detects a row winner correctly', async () => {
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'X', 'X'],
      ['O', 'O', ''],
      ['', '', '']
    ]

    const result = wrapper.vm.checkWinner(3, 3)
    expect(result).toEqual({ player: 'X', line: [[0, 0], [0, 1], [0, 2]] });
  })

  it('detects a column winner correctly', async () => {
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'O', ''],
      ['X', 'O', ''],
      ['X', '', '']
    ]

    const result = wrapper.vm.checkWinner(3, 3)
    expect(result).toEqual({ player: 'X', line: [[0, 0], [1, 0], [2, 0]] });
  })

  it('detects a diagonal winner correctly', async () => {
    const boardStore = useBoardStore()
    boardStore.board = [
      ['X', 'O', ''],
      ['O', 'X', ''],
      ['O', '', 'X']
    ]

    const result = wrapper.vm.checkWinner(3, 3)
    expect(result).toEqual({ player: 'X', line: [[0, 0], [1, 1], [2, 2]] });
  })

  it('detects a anti-diagonal winner correctly', async () => {

    const boardStore = useBoardStore()
    boardStore.board = [
      ['O', 'O', 'X'],
      ['O', 'X', ''],
      ['X', '', '']
    ]

    const result = wrapper.vm.checkWinner(3, 3)
    expect(result).toEqual({ player: 'X', line: [[0, 2], [1, 1], [2, 0]] });
  })

    it('changes game settings and navigates to settings page', async () => {
      const pushSpy = vi.spyOn(mockRouter, 'push');

      await wrapper.vm.changeGameSettings();
      expect(pushSpy).toHaveBeenCalledWith('/settings');
  });

    it('checks if the cell is already taken', async () => {
      const boardStore = useBoardStore()
      boardStore.board = [
        ['X', 'O', 'X'],
        ['', '', ''],
        ['', '', '']
      ]

      const result = wrapper.vm.handleClick(1, 3)
      expect(result).toBe(undefined)
    })

    it('checks if the game restarts correctly when the button is clicked', async () => {
      const boardStore = useBoardStore()
      boardStore.board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
      ]

      const restartBtn = wrapper.findAll('.restart-button').at(0)
      await restartBtn.trigger('click')
      await nextTick()


      expect(boardStore.board).toEqual([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ])
    })
})