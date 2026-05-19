import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts.css'
import './assets/rich-text.css'
import { installViewportHeightSync } from './utils/viewport.js'

installViewportHeightSync()

const app = createApp(App)

app.use(router)

app.mount('#app')
