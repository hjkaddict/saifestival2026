import { artistsData } from './artists.js'

export const performanceSchedule = [
  {
    id: 'perf-0710',
    shortLabel: { kr: '7/10 (금)', en: '7/10 (FRI)' },
    dateLabel: { kr: '7월 10일 (금)', en: 'JUL 10 (FRI)' },
    time: { kr: '오후 7시 - 10시', en: '7pm - 10pm' },
    naverBookingUrl: null,
    acts: ['The Great △', 'Jiyoung Wi', 'Container', 'Dayoon Lee'],
  },
  {
    id: 'perf-0711',
    shortLabel: { kr: '7/11 (토)', en: '7/11 (SAT)' },
    dateLabel: { kr: '7월 11일 (토)', en: 'JUL 11 (SAT)' },
    time: { kr: '오후 7시 - 10시', en: '7pm - 10pm' },
    naverBookingUrl: null,
    acts: ['HELM', 'Luciano Maggiore', 'Seiji Morimoto', 'Tzu Ni', 'Eric Wong'],
  },
  {
    id: 'perf-0717',
    shortLabel: { kr: '7/17 (금)', en: '7/17 (FRI)' },
    dateLabel: { kr: '7월 17일 (금)', en: 'JUL 17 (FRI)' },
    time: { kr: '오후 7시 - 10시', en: '7pm - 10pm' },
    naverBookingUrl: null,
    acts: [
      'Yan Jun',
      {
        id: 'audrey-nick',
        keys: ['Audrey Chen', 'Nick Klein'],
        label: { kr: '오드리 첸 + 닉 클라인', en: 'Audrey Chen + Nick Klein' },
      },
      'dianaband',
      'Zhao Ziyi',
    ],
  },
  {
    id: 'perf-0718',
    shortLabel: { kr: '7/18 (토)', en: '7/18 (SAT)' },
    dateLabel: { kr: '7월 18일 (토)', en: 'JUL 18 (SAT)' },
    time: { kr: '오후 7시 - 10시', en: '7pm - 10pm' },
    naverBookingUrl: null,
    acts: ['Choi Joonyong', 'Evicshen', 'EVOL', 'minsungsig'],
  },
]

function findArtistByKey(key) {
  return artistsData.find((a) => a.name_en.includes(key) || a.name_kr.includes(key))
}

/** @param {import('./program_performance_schedule.js').PerformanceSchedule[number]['acts']} acts */
export function resolvePerformanceActs(acts) {
  return acts
    .map((act) => {
      if (typeof act === 'string') {
        const artist = findArtistByKey(act)
        return artist ? { kind: 'solo', artist } : null
      }
      const artists = act.keys.map((key) => findArtistByKey(key)).filter(Boolean)
      if (!artists.length) return null
      return { kind: 'duo', id: act.id, label: act.label, artists }
    })
    .filter(Boolean)
}

/** @param {import('./program_performance_schedule.js').PerformanceSchedule[number]['acts']} acts @param {'kr' | 'en'} lang */
export function getActDisplayNames(acts, lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return resolvePerformanceActs(acts).map((item) =>
    item.kind === 'solo' ? (l === 'kr' ? item.artist.name_kr : item.artist.name_en) : item.label[l],
  )
}

/** @param {'kr' | 'en'} lang */
export function getPerformanceShows(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return performanceSchedule.map((show) => ({
    id: show.id,
    label: show.shortLabel[l],
    dateLabel: show.dateLabel[l],
    artists: getActDisplayNames(show.acts, l),
    programHash: `#${show.id}`,
    naverBookingUrl: show.naverBookingUrl,
  }))
}
