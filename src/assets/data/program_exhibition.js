export const programExhibition = {
  title: {
    kr: `전시`,
    en: `Exhibition`,
  },
  description: {
    kr: ``.trim(),
    en: ``.trim(),
  },
  period: {
    kr: `7월 10일 (금) – 7월 18일 (토)`.trim(),
    en: `JUL 10 (FRI) – JUL 18 (SAT)`.trim(),
  },
  openingHours: {
    kr: `금 · 토 오후 12–7시 / 일–목 오후 12–8시`.trim(),
    en: `FRI · SAT 12pm - 7pm / SUN–THU 12pm - 8pm`.trim(),
  },
  works: [
    {
      id: 'andrew-ross',
      artist: { kr: '앤드류 로스', en: 'Andrew Ross' },
      title: { kr: '가스 마스크', en: 'Gas Masks' },
      description: { kr: '', en: '' },
    },
    {
      id: 'sollee-kim',
      artist: { kr: '김솔이', en: 'Sollee Kim' },
      title: { kr: '', en: '' },
      description: { kr: '', en: '' },
    },
    {
      id: 'haryung-lee',
      artist: { kr: '이하령', en: 'Haryung Lee' },
      title: { kr: '', en: '' },
      description: { kr: '', en: '' },
    },
    {
      id: 'tuukka-laurila',
      artist: { kr: '투카 라우리라', en: 'Tuukka Laurila' },
      title: { kr: '', en: '' },
      description: { kr: '', en: '' },
    },
    {
      id: 'hugo-esquinca',
      artist: { kr: '휴고 에스킨카', en: 'Hugo Esquinca' },
      title: { kr: 'CONDICIÓN_0726', en: 'CONDICIÓN_0726' },
      description: {
        kr: '',
        en: `Amid today's emphasis on multichannel and immersive audio experiences, <i>CONDICIÓN_0726</i> instead explores a stark monaural condition.
For the installation/intervention, the line array examines the interplay between peripheral architecture and the building's inherent standing waves. It amplifies discontinuous resonances that echo pointlessly, for no listener in particular. Nevertheless, visitors are encouraged to approach the building and hear the space, especially at night.
At night, the line array is lit up.`,
      },
    },
    {
      id: 'nick-klein',
      artist: { kr: '닉 클라인', en: 'Nick Klein' },
      title: { kr: '', en: '' },
      description: { kr: '', en: '' },
    },
    {
      id: 'li-qihang',
      artist: { kr: '리 치항', en: 'Li Qihang' },
      title: { kr: '머큐리 파티오', en: 'Mercury Patio' },
      description: { kr: '', en: '' },
    },
  ],
}

export function getExhibitionWork(id) {
  return programExhibition.works.find((work) => work.id === id) || null
}
