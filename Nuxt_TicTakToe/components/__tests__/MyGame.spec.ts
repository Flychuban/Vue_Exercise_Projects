import { mount, shallowMount } from "@vue/test-utils"
import MyGame from "../MyGame.vue"
import { createTestingPinia } from '@pinia/testing'
import { useSettingsStore } from '../../store/settings_store'
import { useBoardStore } from '../../store/board_store'

describe('MyGame.vue', () => {
  let settingsStore: ReturnType<typeof useSettingsStore>
  let boardStore: ReturnType<typeof useBoardStore>

  beforeEach(() => {
    const pinia = createTestingPinia({ stubActions: false })
    settingsStore = useSettingsStore(pinia)
    boardStore = useBoardStore(pinia)

    settingsStore.$patch({
      numRows: 3,
      numColumns: 3,
      player1_name: 'Player 1',
      player2_name: 'Player 2',
    })

    boardStore.initBoard()
  })

  it('renders properly', () => {
    const wrapper = shallowMount(MyGame, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes game correctly', () => {
    const wrapper = mount(MyGame, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(boardStore.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ])
    expect(wrapper.vm.currentPlayer).toBe('X')
  })

  it('handles a cell click correctly', async () => {
    const wrapper = mount(MyGame, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const cell = wrapper.find('.cell')
    await cell.trigger('click')

    expect(boardStore.board[0][0]).toBe('X')
    expect(wrapper.vm.currentPlayer).toBe('O')
  })

  it('detects a win correctly', async () => {
    const wrapper = mount(MyGame, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    boardStore.board[0][0] = 'X'
    boardStore.board[0][1] = 'X'
    boardStore.board[0][2] = 'X'
    await wrapper.vm.$nextTick()

    const winner = wrapper.vm.checkWinner(3, 3)
    expect(winner).toEqual({ player: 'X', line: [[0, 0], [0, 1], [0, 2]] })
  })

  it('detects a draw correctly', async () => {
    const wrapper = mount(MyGame, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    boardStore.board = [
      ['X', 'O', 'X'],
      ['X', 'X', 'O'],
      ['O', 'X', 'O'],
    ]
    await wrapper.vm.$nextTick()

    const isFull = wrapper.vm.checkBoardFull()
    expect(isFull).toBe(true)
  })
})