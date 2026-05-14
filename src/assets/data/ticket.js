import { programExhibition } from './program_exhibition.js'
import { programWorkshop } from './program_workshop.js'
import { programPerformance } from './program_performance.js'
import { getPerformanceShows } from './program_performance_schedule.js'

export const ticketPage = {
  kr: {
    title: '티켓',
    performanceHeading: '퍼포먼스 티켓',
    salesHeading: '예매 기간',
    priceHeading: '요금',
    datesHeading: '회차',
    viewProgramLabel: '프로그램에서 보기',
    bookLabel: '네이버 예약',
    bookOpens: '5월 30일 오픈',
  },
  en: {
    title: 'Ticket',
    performanceHeading: 'Performance Tickets',
    salesHeading: 'On sale',
    priceHeading: 'Prices',
    datesHeading: 'Dates',
    viewProgramLabel: 'View in program',
    bookLabel: 'Book on Naver',
    bookOpens: 'Opens 30 May',
  },
}

export const ticketPrograms = [
  { id: 'exhibition', source: programExhibition, admission: { kr: '무료', en: 'Free' } },
  { id: 'workshop', source: programWorkshop, admission: { kr: '무료', en: 'Free' } },
  { id: 'performance', source: programPerformance, admission: { kr: '유료', en: 'Paid' } },
]

export const ticketSalesInfo = {
  kr: {
    earlyBirdLabel: '얼리버드',
    earlyBirdPeriod: '5월 30일 – 6월 20일',
    regularLabel: '일반권',
    regularPeriod: '6월 21일 이후 · 현장 결제',
  },
  en: {
    earlyBirdLabel: 'Early Bird',
    earlyBirdPeriod: '30 May – 20 June',
    regularLabel: 'Regular',
    regularPeriod: 'From 21 June · on-site',
  },
}

export const performancePriceTiers = [
  {
    id: 'early',
    label: { kr: '얼리버드', en: 'Early Bird' },
    price: { kr: '18,000원', en: '₩18,000' },
  },
  {
    id: 'regular',
    label: { kr: '일반권 · 현장', en: 'Regular · on-site' },
    price: { kr: '25,000원', en: '₩25,000' },
  },
]

export const ticketFootnotes = {
  kr: {
    heading: '안내',
    bullets: [
      '온라인으로 구매하신 분은 현장 확인 후 퍼포먼스 팔찌와 음료 쿠폰을 수령해 주세요.',
      '티켓 1매당 음료 쿠폰 1장(커피 또는 맥주)이 제공됩니다.',
      '회차당 120매 한정입니다.',
    ],
  },
  en: {
    heading: 'Notes',
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
      dates,
      hours,
      isPaid: program.id === 'performance',
    }
  })
}

/** @param {'kr' | 'en'} lang */
export function getTicketSales(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  const info = ticketSalesInfo[l]
  return {
    earlyBirdLabel: info.earlyBirdLabel,
    earlyBirdPeriod: info.earlyBirdPeriod,
    regularLabel: info.regularLabel,
    regularPeriod: info.regularPeriod,
  }
}

/** @param {'kr' | 'en'} lang */
export function getPerformancePrices(lang) {
  const l = lang === 'kr' ? 'kr' : 'en'
  return performancePriceTiers.map((tier) => ({
    id: tier.id,
    label: tier.label[l],
    price: tier.price[l],
  }))
}

/** @param {'kr' | 'en'} lang */
export function getPerformanceShowDates(lang) {
  return getPerformanceShows(lang)
}
