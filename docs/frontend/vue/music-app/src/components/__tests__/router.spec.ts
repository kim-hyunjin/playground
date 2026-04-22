import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItemVue from '../SongItem.vue'
import { describe, expect, test } from 'vitest'
import { dummySongs } from '@/fixture'

describe('Router', () => {
  test('renders router link', () => {
    const song = dummySongs[0]

    const wrapper = shallowMount(SongItemVue, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
      name: 'song',
      params: { id: song.doc_id }
    })
  })
})
