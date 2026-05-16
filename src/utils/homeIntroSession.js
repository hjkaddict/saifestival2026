/** 탭(session) 동안만 유지: 홈 인트로·메뉴 배치·전역 InterventionCanvas 1회성 완료 여부 */

export const HOME_INTRO_SESSION_KEY = 'saifestival:home:intro:v1'

export function readHomeIntroSession() {
  try {
    const raw = sessionStorage.getItem(HOME_INTRO_SESSION_KEY)
    if (!raw) return null
    const typed = JSON.parse(raw)
    if (typed.v !== 1 || !Array.isArray(typed.menus) || !typed.introComplete) {
      return null
    }
    return typed
  } catch {
    return null
  }
}

export function writeHomeIntroSession(payload) {
  sessionStorage.setItem(HOME_INTRO_SESSION_KEY, JSON.stringify({ v: 1, ...payload }))
}

export function clearHomeIntroSession() {
  sessionStorage.removeItem(HOME_INTRO_SESSION_KEY)
}
