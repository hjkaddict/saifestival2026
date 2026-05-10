// src/store/locale.js
import { reactive } from 'vue'

export const localeStore = reactive({
  lang: 'en',
  setLang(newLang) {
    this.lang = newLang
  },
})
