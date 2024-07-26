import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Default from '../Default.vue'
import { useSettingsStore } from '../../store/settings_store'
import { useBoardStore } from '../../store/board_store'
import { createRouter, createWebHistory } from 'vue-router'
import { onBeforeMount } from 'vue'

// const router = {
//     push : vi.fn()
// }
describe('Default.vue', () => {
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

    vi.spyOn(mockRouter, 'push');
  })

  it('checks localStorage and redirects to /game when settings are available', async () => {
    localStorage.setItem('settings', JSON.stringify({
        rows: 3,
        columns: 3,
        player_1: 'Gosho',
        player_2: 'Pesho'
    }))

    wrapper = mount(Default, {
      global: {
        plugins: [mockRouter],
      },
    })

    // await wrapper.vm.saveSettings();
    expect(mockRouter.push).toHaveBeenCalledWith('/game');
  })

  it('checks localStorage and redirects to /settings when settings are not available', async () => {

    // Clear the localStorage value
    localStorage.removeItem('settings')
    
    wrapper = mount(Default, {
      global: {
        plugins: [mockRouter],
      },
    })

    // await wrapper.vm.saveSettings();
    expect(mockRouter.push).toHaveBeenCalledWith('/settings');
  })
})