import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import settings from '../settings.vue'


describe('settings.vue', () => {

    let wrapper: any
    
    beforeEach(() => {
        wrapper = mount(settings)
    })

    it.only('renders the title correctly', () => {
        expect(wrapper.find('h1').text()).toBe('Tic Tac Toe')
    })
})