import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import game from '../game.vue'


describe('game.vue', () => {

    let wrapper: any
    
    beforeEach(() => {
        wrapper = mount(game)
    })

    it('renders the title correctly', () => {
        expect(wrapper.find('h1').text()).toBe('Tic Tac Toe')
    })
})