import type { SongWithID } from '@/models/song'
import SongItemVue from '../SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { dummySongs } from '../../fixture'

describe('SongItem.vue', () => {
  test('renders song.display_name', () => {
    const song: SongWithID = dummySongs[0]
    const wrapper = shallowMount(SongItemVue, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  test('renders song.doc_id in id attribute', () => {
    const song: SongWithID = dummySongs[0]
    const wrapper = shallowMount(SongItemVue, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.attributes('id')).toBe(song.doc_id)
  })
})
