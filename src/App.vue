<template>
  <div id="app-root">
    <button class="lang-globe-btn" @click.stop="toggleLang" aria-label="Toggle Language">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-globe"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20" />
        <path d="M2 12h20" />
      </svg>
      <span class="curr-lang-tag">{{ locale.lang === 'kr' ? 'KO' : 'EN' }}</span>
    </button>

    <main class="router-stage">
      <router-view />
    </main>

    <InterventionCanvas />
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import InterventionCanvas from '@/components/InterventionCanvas.vue'

export default {
  name: 'App',
  components: {
    InterventionCanvas,
  },
  data() {
    return {
      locale: localeStore,
    }
  },
  methods: {
    toggleLang() {
      const newLang = this.locale.lang === 'kr' ? 'en' : 'kr'
      this.locale.setLang(newLang)
    },
  },
}
</script>

<style>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  background: #000000;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: #fff; /* 전체 배경 흰색 고정 */
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background-color: #fff; /* 캔버스 연산을 위한 기준색 */
}

.router-stage {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 10;
}

.lang-globe-btn {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 10000;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  color: #000; /* 버튼은 검은색으로 고정하거나 취향껏 변경 */
  display: flex;
  align-items: center;
  gap: 5px;
}

.lang-globe-btn svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}

.curr-lang-tag {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
