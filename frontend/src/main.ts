import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'


declare global {
  interface Window {
    pywebview: {
      api: PyWebViewApi;
    }
  }
}

const app =  createApp(App)
const pinia = createPinia()
const queryClient = new QueryClient()



window.addEventListener('pywebviewready', () => {
  console.log('PyWebView is ready')
  app.use(router)
  app.use(pinia)
  app.use(VueQueryPlugin, {queryClient})
  app.mount('#app')
  console.log('Vue app mounted successfully')
})
