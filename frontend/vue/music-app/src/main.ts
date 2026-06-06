import './assets/main.css'

import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'
import icon from './directives/icon'

import App from './App.vue'
import router from './router'
import i18n from './includes/i18n'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

let app: VueApp

// firebase sdk can know that user is authenticated or not by checking indexed DB
// firebase가 먼저 auth state를 확인한 후 mount시키도록 함
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.directive('icon', icon)

    app.mount('#app')
  }
})
