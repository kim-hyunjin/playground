import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

type User = {
  name: string
  email: string
  password: string
  age: number
  country: string
}

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values: User) {
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)

      await setDoc(doc(usersCollection, userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await updateProfile(userCred.user, { displayName: values.name })

      this.userLoggedIn = true
    },
    async authenticate(values: { email: string; password: string }) {
      await signInWithEmailAndPassword(auth, values.email, values.password)

      this.userLoggedIn = true
    },
    async signOut() {
      await auth.signOut()

      this.userLoggedIn = false
    }
  }
})
