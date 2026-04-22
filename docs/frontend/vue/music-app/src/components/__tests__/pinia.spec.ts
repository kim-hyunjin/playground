import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import useUserStore from '@/stores/user'

vi.mock('@/includes/firebase', () => ({
  auth: {}
}))

vi.mock('firebase/auth', async () => {
  return {
    createUserWithEmailAndPassword: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.resolve()
  }
})

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticate user', async () => {
    const store = useUserStore()

    expect(store.userLoggedIn).toBe(false)

    await store.authenticate({ email: '', password: '' })

    expect(store.userLoggedIn).toBe(true)
  })
})
