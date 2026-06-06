import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  initializeFirestore,
  persistentLocalCache
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: '',
  authDomain: 'music-344ed.firebaseapp.com',
  projectId: 'music-344ed',
  storageBucket: 'music-344ed.appspot.com',
  appId: '1:1084158072091:web:fa1a3f67d820ffbb7defbe'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
initializeFirestore(app, { localCache: persistentLocalCache() })

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

const usersCollection = collection(db, 'users')
const songsCollection = collection(db, 'songs')
const commentsCollection = collection(db, 'comments')

export { auth, db, usersCollection, songsCollection, commentsCollection, storage }
