import { describe, expect, test } from 'vitest'
import AboutViewVue from '@/views/AboutView.vue'
import { shallowMount } from '@vue/test-utils'

describe('About.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutViewVue)

    expect(wrapper.text()).toContain('About...')
  })
})
