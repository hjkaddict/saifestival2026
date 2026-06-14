<template>
  <div
    class="blank-view app-min-vh"
    :class="locale.lang === 'kr' ? 'blank-view--ko' : 'blank-view--en'"
  >
    <p class="blank-view__message">{{ message }}</p>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'

export default {
  name: 'BlankView',
  data() {
    return {
      locale: localeStore,
    }
  },
  computed: {
    message() {
      return this.locale.lang === 'kr'
        ? '업데이트 될 예정입니다.'
        : 'Will be updated.'
    },
  },
}
</script>

<style scoped>
.blank-view {
  display: grid;
  place-items: center;
  width: 100%;
  background: #fff;
  color: rgba(10, 10, 10, 0.82);
  font-size: 1rem;
  font-weight: 100;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: center;
}

.blank-view--ko {
  font-family: var(--font-home-ko);
}

.blank-view--en {
  font-family: var(--font-home-en);
}

.blank-view__message {
  margin: 0;
}
</style>
