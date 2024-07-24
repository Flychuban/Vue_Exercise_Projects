import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GameSettings from '../GameSettings.vue'
import { useSettingsStore } from '../../store/settings_store'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

setActivePinia(createPinia())

describe('GameSettings.vue', () => {
  let wrapper: any

  let settingsStore = useSettingsStore()
  beforeEach(() => {

    settingsStore.numRows = 3
    settingsStore.numColumns = 3
    settingsStore.player1_name = 'Gosho'
    settingsStore.player2_name = 'Pesho'



    wrapper = mount(GameSettings, {
    })
  })


  it('should validate rows correctly', async () => {
    settingsStore.numRows = 2
    await wrapper.vm.validateRows()
    console.log(wrapper.vm.rowErrorMessage)
    expect(wrapper.vm.rowErrorMessage).toBe('Rows cannot be less than 3.')

    settingsStore.numRows = 21
    await wrapper.vm.validateRows()
    expect(wrapper.vm.rowErrorMessage).toBe('Rows cannot be more than 20.')

    settingsStore.numRows = 5
    await wrapper.vm.validateRows()
    expect(wrapper.vm.rowErrorMessage).toBe('')
  })

  it('should validate columns correctly', async () => {
    settingsStore.numColumns = 2
    await wrapper.vm.validateColumns()
    expect(wrapper.vm.columnErrorMessage).toBe('Columns cannot be less than 3.')

    settingsStore.numColumns = 21
    await wrapper.vm.validateColumns()
    expect(wrapper.vm.columnErrorMessage).toBe('Columns cannot be more than 20.')

    settingsStore.numColumns = 5
    await wrapper.vm.validateColumns()
    expect(wrapper.vm.columnErrorMessage).toBe('')
  })

  it('should validate player names correctly', async () => {
        // Mock the global alert function
    const alertMock = vi.fn()
    global.alert = alertMock

    settingsStore.player1_name = ''
    await wrapper.vm.validatePlayerNames()
    expect(settingsStore.player1_name).toBe('X')
    expect(alertMock).toHaveBeenCalledWith('Player names cannot be empty')

    settingsStore.player2_name = ''
    await wrapper.vm.validatePlayerNames()
    expect(settingsStore.player2_name).toBe('O')
    expect(alertMock).toHaveBeenCalledWith('Player names cannot be empty')

    settingsStore.player1_name = 'A very very very very very very long name'
    await wrapper.vm.validatePlayerNames()
    expect(settingsStore.player1_name).toBe('X')
    expect(alertMock).toHaveBeenCalledWith('Player names cannot be more than 40 characters')

    settingsStore.player2_name = 'A very very very very very very long name'
    await wrapper.vm.validatePlayerNames()
    expect(settingsStore.player2_name).toBe('O')
    expect(alertMock).toHaveBeenCalledWith('Player names cannot be more than 40 characters')

    settingsStore.player1_name = 'Player1'
    settingsStore.player2_name = 'Player1'
    await wrapper.vm.validatePlayerNames()
    expect(settingsStore.player1_name).toBe('X')
    expect(settingsStore.player2_name).toBe('O')
    expect(alertMock).toHaveBeenCalledWith('Player names cannot be the same')

    settingsStore.player1_name = 'Player1'
    settingsStore.player2_name = 'Player2'
    const valid = await wrapper.vm.validatePlayerNames()
    expect(valid).toBe(false)
    expect(settingsStore.player1_name).toBe('X')
    expect(settingsStore.player2_name).toBe('O')
    expect(alertMock).toHaveBeenCalledWith('Player names can only contain letters and spaces')

    // Restore the original alert function after the test
    vi.restoreAllMocks()
  })

  it('should save settings correctly', async () => {
    // Mock localStorage
    const localStorageMock = (function () {
      let store: any = {}

      return {
        getItem(key: string) {
          return store[key] || null
        },
        setItem(key: string, value: string) {
          store[key] = value
        },
        clear() {
          store = {}
        },
      }
    })()

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    await wrapper.vm.saveSettings()

    const settings = JSON.parse(localStorage.getItem('settings'))

    expect(settings.rows).toBe(settingsStore.numRows)
    expect(settings.columns).toBe(settingsStore.numColumns)
    expect(settings.player1_name).toBe(settingsStore.player1_name)
    expect(settings.player2_name).toBe(settingsStore.player2_name)
  })
})