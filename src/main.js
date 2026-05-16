import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts.css'
import './assets/organic-highlight.css'
import './assets/image-fade.css'
import { fadeInImg } from './directives/fadeInImg.js'
import { installViewportHeightSync } from './utils/viewport.js'

installViewportHeightSync()

const app = createApp(App)

app.use(router)
app.directive('fade-in-img', fadeInImg)

app.mount('#app')
