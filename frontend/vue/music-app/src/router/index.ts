import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardWithThis
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ManageView from '@/views/ManageView.vue'
import SongView from '@/views/SongView.vue'
import useUserStore from '@/stores/user'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    name: 'home',
    alias: '/music',
    path: '/',
    component: HomeView
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView
  },
  {
    name: 'manage',
    path: '/manage-music',
    component: ManageView,
    meta: {
      requiresAuth: true
    }
    // beforeEnter: (to, from, next) => {
    //   console.log('manage route guard')
    //   next()
    // }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' } // redirect is better for SEO
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

const globalGuard: NavigationGuardWithThis<undefined> = (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()

  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
}

router.beforeEach(globalGuard)

export default router
