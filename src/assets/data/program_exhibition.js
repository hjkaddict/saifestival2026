export const programExhibition = {
  title: {
    kr: `전시`,
    en: `Exhibition`,
  },
  description: {
    kr: `전시 프로그램의 참여 예술가들은 기획 단계에서부터 전시장과 무대 공간의 조건을 새롭게 구성해줄 것을 요청받았다. 앤드류 로스의 무대 구조물, 김솔이의 모듈형 조각 구조, 이하령의 증식하는 구형 오브젝트는 고정된 조각이라기보다 관객과 퍼포머의 이동, 사용과 시간의 흐름 속에서 상태를 바꾸는 구조로 기능한다. 투카 라우리라는 지역의 재활용 자재와 잉여 건축 자재를 활용해 전시장 내부에 하나의 '살아있는 환경'을 구축한다. 이들이 만들어내는 좌석과 무대, 스피커와 조각, 설치 작업들은 공간의 구조를 계속 변화시킨다.

전시장 내부의 음향 조건 역시 주요한 구성 요소로 작동한다. 휴고 에스킨카는 고출력 사운드 시스템을 설치이자 환경적 요소로 다루며, 관객이 없는 운영 시간 이후에도 지속되는 음향 조건을 제안한다. 닉 클라인의 대형 배너 작업은 퍼포먼스와 사운드, 설치가 뒤섞이는 공간의 분위기와 리듬을 형성하는 장치로 기능한다. 리  치항은 기존 프로젝트 Mercury Patio를 대전의 맥락 안에서 확장하며, 셔틀버스를 기다리는 공간을 일시적인 전이 공간으로 전환시킨다. 이동과 대기, 반복과 지연 속에서 발생하는 감각의 변화 역시 이번 페스티벌의 중요한 요소 중 하나다.`.trim(),
    en: `The artists participating in the exhibition program were invited from the planning stage to reconfigure the conditions of the exhibition and stage spaces. Andrew Ross's stage structure, Sollee Kim's modular sculptural structure, and Haryung Lee's proliferating spherical objects function less as fixed sculptures than as structures whose states shift through the movement of audiences and performers, through use, and over time. Tuukka Laurila builds a "living environment" inside the exhibition space using local recycled materials and surplus construction materials. The seating, stages, speakers, sculptures, and installations they create continually alter the structure of the space.

The acoustic conditions inside the exhibition space also operate as a central component. Hugo Esquinca treats a high-powered sound system as both an installation and an environmental element, proposing sonic conditions that continue even after operating hours, when no audience is present. Nick Klein's large-scale banner functions as a device that shapes the atmosphere and rhythm of a space where performance, sound, and installation intersect. Li Qihang expands her existing project Mercury Patio within the context of Daejeon, transforming the space where visitors wait for the shuttle bus into a temporary space of transition. The sensory changes that arise through movement and waiting, repetition and delay, are also among the important elements of this festival.`.trim(),
  },
  period: {
    kr: `7월 10일 – 7월 18일`.trim(),
    en: `JUL 10 – JUL 18`.trim(),
  },
  openingHours: {
    kr: `금, 토: 오후 12시 - 오후 7시 | 일 - 목: 오후 12시 - 오후 8시`.trim(),
    en: `Fri, Sat: 12pm - 7pm | Sun - Thu: 12pm - 8pm`.trim(),
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
