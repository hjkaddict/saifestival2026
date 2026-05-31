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
      title: { kr: '임시 스튜디오', en: 'Temporary Studio' },
      description: {
        kr: `투카 라우리라의 공개 워크숍은 현장에서 수집한 폐건축 자재로 구축하는 ‘살아있는 공간'이라는 프로젝트의 일환으로, 2일간 진행됩니다. 

참여자들은 함께 자재를 모으고 분류하고 쌓아 나가면서 임시 구조물을 만듭니다. 이렇게 만들어진 구조물은 변형 가능한 것으로, 최종적으로는 재활용될 것입니다.

라우리라에게 있어, 작업이란 곧 과정입니다. 구조물 짓기라는 행위와 그 속에서 일어나는 교류를 통해 형성되는 임시 공동체는 오늘날 물질주의적인 세상이 추구하는 끊임없는 새로움에 맞선 저항의 실마리를 제시하고 있습니다.`.trim(),
        en: `Open workshop sessions at SA-I Festival with Paris-based artist Tuukka Laurila will take place over two days as part of an ongoing "living environment" constructed from locally sourced found and discarded building materials.

Throughout the workshop, materials will be collectively gathered, sorted, and gradually assembled into temporary structures that remain open to modification, and in the end, return to existing cycles of reuse.

For Laurila, the process is the work: a temporary community formed through building and exchange, within a space that is a proposition against the perpetual newness of today's material world.`.trim(),
      },
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
