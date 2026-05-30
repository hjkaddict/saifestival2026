import { programExhibition } from './program_exhibition.js'
import { programWorkshop } from './program_workshop.js'
import { programPerformance } from './program_performance.js'
import { eventusBookingUrl } from './program_performance_schedule.js'

/** Performance booking on Eventus. */
export const performanceBooking = {
  url: eventusBookingUrl,
}

export const ticketPage = {
  kr: {
    title: '티켓',
    bookLabel: '예매링크',
    bookOpens: '6월 1일 오픈',
  },
  en: {
    title: 'Ticket',
    bookLabel: 'Booking link',
    bookOpens: 'Open 1 June',
  },
}

export const ticketPrograms = [
  {
    id: 'performance',
    source: programPerformance,
    admission: { kr: '관람권', en: 'Admission' },
  },
  { id: 'exhibition', source: programExhibition, admission: { kr: '무료', en: 'Free' } },
  { id: 'workshop', source: programWorkshop, admission: { kr: '무료', en: 'Free' } },
]

export const performancePriceTiers = [
  {
    id: 'early',
    label: { kr: '얼리버드', en: 'Early Bird' },
    period: {
      kr: '6월 1일 (월) – 6월 30일 (화)',
      en: 'JUN 1 (MON) – JUN 30 (TUE)',
    },
    price: { kr: '1일 15,000원', en: '1 day · ₩15,000' },
  },
  {
    id: 'regular',
    label: { kr: '일반권 · 현장', en: 'Regular · on-site' },
    period: {
      kr: '7월 1일 (수) 이후',
      en: 'From JUL 1 (WED)',
    },
    price: { kr: '1일 22,000원', en: '1 day · ₩22,000' },
  },
]

export const ticketFootnotes = {
  kr: {
    bullets: [
      '온라인 예매를 하신 분들은 해당 퍼포먼스 당일, 현장에서 입장 팔찌와 음료 쿠폰을 수령해주세요.',
      '모든 퍼포먼스는 오후 7시 시작 예정입니다.',
      '티켓 1매당 음료 쿠폰 1장(커피 또는 맥주)이 제공됩니다.',
      '퍼포먼스 회차당 150매 한정입니다.',
    ],
  },
  en: {
    bullets: [
      'For online ticket holders, admission wristbands and drink vouchers can be collected at the venue on the day of the performance.',
      'All performances are scheduled to start at 7PM.',
      'Each ticket includes one complimentary drink voucher (coffee or beer).',
      'Capacity is limited to 150 tickets per performance date.',
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
    const name = program.source.title[l]
    return {
      id: program.id,
      name,
      admission: program.admission[l],
      dates,
      hours,
      isPaid: program.id === 'performance',
      viewProgramLabel:
        l === 'kr' ? `${name} 프로그램 보러가기` : `View ${name} program`,
      programHash: `#${program.id}`,
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
