import { programExhibition } from './program_exhibition.js'
import { programWorkshop } from './program_workshop.js'
import { programPerformance } from './program_performance.js'
import { getPerformanceShows } from './program_performance_schedule.js'

/** Set when Naver (or other) performance booking goes live. */
export const performanceBooking = {
  url: null,
}

export const ticketPage = {
  kr: {
    title: '티켓',
    bookLabel: '예매',
    bookOpens: '5월 30일 오픈',
  },
  en: {
    title: 'Ticket',
    bookLabel: 'Book',
    bookOpens: 'Open 30 May',
  },
}

export const ticketPrograms = [
  { id: 'exhibition', source: programExhibition, admission: { kr: '무료', en: 'Free' } },
  { id: 'workshop', source: programWorkshop, admission: { kr: '무료', en: 'Free' } },
  {
    id: 'performance',
    source: programPerformance,
    admission: { kr: '관람권', en: 'Admission' },
  },
]

export const performancePriceTiers = [
  {
    id: 'early',
    label: { kr: '얼리버드', en: 'Early Bird' },
    period: { kr: '판매 기간: 5월 30일 – 6월 20일', en: 'Sales period: 30 May – 20 June' },
    price: { kr: '1일 15,000원', en: '1 day · ₩15,000' },
  },
  {
    id: 'regular',
    label: { kr: '일반권 · 현장', en: 'Regular · on-site' },
    period: { kr: '판매 기간: 6월 21일 이후', en: 'Sales period: From 21 June' },
    price: { kr: '1일 22,000원', en: '1 day · ₩22,000' },
  },
]

export const ticketFootnotes = {
  kr: {
    bullets: [
      '온라인으로 티켓을 구매하신 분들은 현장에서 퍼포먼스 입장 팔찌와 음료 쿠폰을 수령해주세요.',
      '티켓 1매당 음료 쿠폰 1장(커피 또는 맥주)이 제공됩니다.',
      '회차당 120매 한정입니다.',
    ],
  },
  en: {
    bullets: [
      'Online buyers must verify their purchase on site to receive a wristband and drink voucher.',
      'Each ticket includes one drink voucher (coffee or beer).',
      'Limited to 120 tickets per performance.',
    ],
  },
}

function programSchedule(source, lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  const dates = source.period?.[l] || source.date?.[l] || ''
  const hoursRaw = source.openingHours?.[l] || ''
  const hours = hoursRaw
    ? hoursRaw
        .split('/')
        .map((line) => line.trim())
        .filter(Boolean)
    : []
  return { dates, hours }
}

/** @param {'kr' | 'en'} lang */
export function getTicketPrograms(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return ticketPrograms.map((program) => {
    const { dates, hours } = programSchedule(program.source, l)
    return {
      id: program.id,
      name: program.source.title[l],
      admission: program.admission[l],
      dates: program.id === 'performance' ? '' : dates,
      hours,
      isPaid: program.id === 'performance',
    }
  })
}

/** @param {'kr' | 'en'} lang */
export function getPerformancePrices(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return performancePriceTiers.map((tier) => ({
    id: tier.id,
    label: tier.label[l],
    period: tier.period[l],
    price: tier.price[l],
  }))
}

/** @param {'kr' | 'en'} lang */
export function getPerformanceShowDates(lang) {
  return getPerformanceShows(lang)
}
