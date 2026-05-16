<!--
  보관용: 단순 링크 나열 임시 메인(플레이스홀더).

  현재 라우터 기본 메인: Home.vue (샤드 + Artists.vue 스타일 라인업 메뉴).

  이 플레이스홀더로 되돌리기:
    1) src/router/index.js 에서
       import Home from '@/views/Home.vue'
       → import Home from '@/views/HomeArchive.vue'
    2) 또는 이 파일 전체를 Home.vue 에 붙여넣고 export default name 을 'Home' 으로 수정
-->
<template>
  <div class="home-placeholder">
    <p class="home-placeholder__note">
      {{ note }}
    </p>
    <nav class="home-placeholder__nav" aria-label="Site sections">
      <router-link v-for="item in navLinks" :key="item.path" :to="item.path" class="home-placeholder__link">
        {{ item.label }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HomeArchive',
  data() {
    return {
      note: '플레이스홀더 메인(보관) — 실제 메인은 Home.vue 입니다.',
      navLinks: [
        { path: '/program', label: 'Program' },
        { path: '/venue', label: 'Venue' },
        { path: '/ticket', label: 'Ticket' },
        { path: '/about', label: 'About' },
        { path: '/artists', label: 'Artists' },
      ],
    }
  },
}
</script>

<style scoped>
.home-placeholder {
  min-height: calc(var(--app-vh, 1vh) * 100);
  box-sizing: border-box;
  padding: clamp(24px, 6vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #fff;
  color: #0a0a0a;
}

.home-placeholder__note {
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  max-width: 28rem;
  line-height: 1.5;
}

.home-placeholder__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  justify-content: center;
}

.home-placeholder__link {
  font-size: 1rem;
  color: #0a0a0a;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition:
    border-color 0.15s ease,
    opacity 0.15s ease;
}

.home-placeholder__link:hover {
  border-bottom-color: currentColor;
  opacity: 0.8;
}
</style>
