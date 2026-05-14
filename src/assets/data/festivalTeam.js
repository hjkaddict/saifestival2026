/** @param {string | null | undefined} handle — @username, username, or full instagram.com URL */
export function instagramUrl(handle) {
  if (!handle || handle === 'TBA') return null
  const trimmed = handle.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const user = trimmed.replace(/^@/, '').replace(/\/$/, '')
  return `https://www.instagram.com/${user}/`
}

const teamSections = [
  {
    role: { kr: '총괄 기획', en: 'Direction & Production' },
    members: [
      {
        name: { kr: '김형중', en: 'Hyungjoong Kim' },
        instagram: 'https://www.instagram.com/hyungjoong_k/',
      },
      { name: { kr: '이선규', en: 'Sunkyu Lee' }, instagram: 'https://www.instagram.com/s_nky_/' },
    ],
  },
  {
    role: { kr: '큐레이션', en: 'Curation' },
    members: [
      {
        name: { kr: '닉 클라인', en: 'Nick Klein' },
        instagram: 'https://www.instagram.com/nickklein____/',
      },
    ],
  },
  {
    role: { kr: '디자인', en: 'Design' },
    members: [
      {
        name: { kr: '최미선', en: 'MiSuN Choi' },
        instagram: 'https://www.instagram.com/misun_choi/',
      },
    ],
  },
  {
    role: { kr: '코디네이션 & 번역', en: 'Coordination & Translation' },
    members: [
      {
        name: { kr: '장한길', en: 'Hangil Jang' },
        instagram: 'https://www.instagram.com/hangiljang_/',
      },
    ],
  },
  {
    role: { kr: '기술감독', en: 'Technical Director' },
    members: [
      {
        name: { kr: '하쿠 승호', en: 'Haku Sungho' },
        instagram: 'https://www.instagram.com/hakusungho/',
      },
    ],
  },
  {
    role: { kr: '사진', en: 'Photo Documentation' },
    members: [{ name: { kr: 'TBA', en: 'TBA' }, instagram: null }],
  },
  {
    role: { kr: '설치 지원', en: 'Installation Support' },
    members: [{ name: { kr: '엔지디', en: 'NGD' }, instagram: null }],
  },
  {
    role: { kr: '주최/주관', en: 'Organization' },
    members: [
      {
        name: { kr: '씨엔씨티마음에너지재단', en: 'CNCITY Foundation' },
        instagram: 'https://www.instagram.com/cncitymaum/',
      },
    ],
  },
  {
    role: { kr: '후원', en: 'Supporters' },
    members: [
      {
        name: { kr: '씨엔씨티에너지, 관사마을', en: 'CNCITY Energy, Gwansa Maeul' },
        instagram: null,
      },
    ],
  },
  {
    role: { kr: '협력', en: 'Partners' },
    members: [
      {
        name: { kr: '에너넷, 인큐버스, 마음이앤에이', en: 'Enernet, Incuvers, Maum E&A' },
        instagram: null,
      },
    ],
  },
]

export const festivalTeamHeading = {
  kr: '사–이 페스티벌 2026',
  en: 'SA–I Festival 2026',
}

/** @param {'kr' | 'en'} lang */
export function getFestivalTeam(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return teamSections.map((section) => ({
    role: section.role[l],
    members: section.members.map((member) => ({
      name: member.name[l],
      url: instagramUrl(member.instagram),
    })),
  }))
}
