import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import SongItemVue from '../SongItem.vue'
import { describe, expect, test } from 'vitest'
import { dummySongs } from '@/fixture'

describe('snapshots SongItem.vue', () => {
  test('renders correctly', () => {
    const song = dummySongs[0]

    const wrapper = shallowMount(SongItemVue, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
