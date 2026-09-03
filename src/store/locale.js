// src/store/locale.js
import { reactive } from 'vue'

export const localeStore = reactive({
  lang: 'kr',
  setLang(newLang) {
    this.lang = newLang
  },
})
