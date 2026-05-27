export const workshopSchedule = [
  {
    id: 'workshop-0713',
    dateLabel: { kr: '7월 13일 (월)', en: 'July 13 Mon' },
    entries: [
      {
        id: 'workshop-eric-wong-0713',
        time: { kr: '오후 1시 - 오후 3시', en: '1PM - 3PM' },
        detailId: 'workshop-eric-wong',
      },
      {
        id: 'workshop-tuukka-laurila-0713',
        time: { kr: '오후 4시 - 오후 7시', en: '4PM - 7PM' },
        detailId: 'workshop-tuukka-laurila',
      },
    ],
  },
  {
    id: 'workshop-0714',
    dateLabel: { kr: '7월 14일 (화)', en: 'July 14 Tue' },
    entries: [
      {
        id: 'workshop-oolongradio-0714',
        time: { kr: '오후 1시 - 오후 3시', en: '1PM - 3PM' },
        detailId: 'workshop-oolongradio',
      },
      {
        id: 'workshop-tuukka-laurila-0714',
        time: { kr: '오후 4시 - 오후 7시', en: '4PM - 7PM' },
        detailId: 'workshop-tuukka-laurila',
      },
    ],
  },
  {
    id: 'workshop-0715',
    dateLabel: { kr: '7월 15일 (수)', en: 'July 15 Wed' },
    entries: [
      {
        id: 'lecture-evol-0715',
        time: { kr: '오후 1시 - 오후 3시', en: '1PM - 3PM' },
        detailId: 'lecture-evol',
      },
      {
        id: 'workshop-haryung-lee-0715',
        time: { kr: '오후 4시 - 오후 7시', en: '4PM - 7PM' },
        detailId: 'workshop-haryung-lee',
      },
    ],
  },
  {
    id: 'workshop-0716',
    dateLabel: { kr: '7월 16일 (목)', en: 'July 16 Thu' },
    entries: [
      {
        id: 'workshop-nick-klein-0716',
        time: { kr: '오후 1시 - 오후 3시', en: '1PM - 3PM' },
        detailId: 'workshop-nick-klein',
      },
      {
        id: 'lecture-audrey-chen-0716',
        time: { kr: '오후 3시 - 오후 5시', en: '3PM - 5PM' },
        detailId: 'lecture-audrey-chen',
      },
      {
        id: 'workshop-dianaband-0716',
        time: { kr: '오후 5시 - 오후 7시', en: '5PM - 7PM' },
        detailId: 'workshop-dianaband',
      },
    ],
  },
]

export const workshopDetails = [
  {
    id: 'workshop-eric-wong',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '에릭 웡', en: 'Eric Wong' },
    title: {
      kr: '즉흥과 기보 음악 사이, 들리지 않는 소리 탐구',
      en: 'BETWEEN IMPROVISATION AND WRITTEN MUSIC, EXPLORING SOUNDS UNHEARD',
    },
    description: {
      kr: ``.trim(),
      en: `Eric Wong will present to interested participants a selection of compositions by Wandelweiser composers, whose work attends not only to what is written in the score, but also to the conditions surrounding each performance. This includes room tone, sounds produced by other performers, the presence of the audience, and, at times, the internal sounds perceived by the performers themselves. Many of these works are characterized by extended durations and a strong emphasis on silence.
      
In this workshop, Wong and participants will study and work through the scores together. The session is open to improvising musicians and performers who are seeking new approaches, composers interested in alternative ways of shaping sound, and non-professional musicians who are curious about written music that leaves space for improvisation.
      
Participants are recommended to bring a musical instrument to the workshop, which includes voice or sound generating apps.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/eric-wong-workshop.png',
        alt: {
          kr: '에릭 웡 워크숍 대표 이미지',
          en: 'Eric Wong workshop representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-tuukka-laurila',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '투카 라우리라', en: 'Tuukka Laurila' },
    title: { kr: '', en: '' },
    description: {
      kr: ``.trim(),
      en: `Tuukka Laurila leads a workshop in which participants continuously modify and expand the internal structure of the exhibition space, centering on processes of collecting, sorting, and assembling materials that extend from his exhibition work.`.trim(),
    },
  },
  {
    id: 'workshop-oolongradio',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '우롱라디오', en: 'oolongradio' },
    title: { kr: '', en: '' },
    description: {
      kr: `업데이트 될 예정입니다.`.trim(),
      en: `Will be updated soon.`.trim(),
    },
  },
  {
    id: 'lecture-evol',
    type: { kr: '렉쳐', en: 'Lecture' },
    artist: { kr: '록 히메네즈 데 시스네로스/이볼', en: 'Roc Jiménez de Cisneros/EVOL' },
    title: { kr: '무제의 드럼 패턴 변주', en: 'UNTITLED DRUM PERMUTATIONS' },
    description: {
      kr: ``.trim(),
      en: `This talk presents a piece built around a simple but overwhelming premise: playing every possible ordering of eleven drum machine sounds — over 39 million unique permutations. Using the iconic sounds of the Roland TR-909, the work becomes a systematic yet strangely meditative exploration of limits, repetition, pattern deformation, and attention.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/roc-jimenez-evol-lecture.png',
        alt: {
          kr: '록 히메네즈 데 시스네로스/이볼 렉쳐 대표 이미지',
          en: 'Roc Jimenez de Cisneros/EVOL lecture representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-haryung-lee',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '이하령', en: 'Haryung Lee' },
    title: { kr: '자급자족', en: 'SELF-SUFFICIENT' },
    description: {
      kr: `중앙동을 산책하며 스티로폼 상자를 하나씩 줍는다. 주운 스티로폼 상자를 들고 페스티벌 장소로 다시 모인다. 스티로폼 상자의 네 모서리를 열선으로 잘라, 강아지를 만든다. 각자 자신이 만든 강아지를 소장한다.`.trim(),
      en: `Participants walk through Jungang-dong, each picking up one styrofoam box. They then return to the festival venue, boxes in hand. Using a hot wire cutter, each participant cuts the four corners of their styrofoam box to shape it into a dog. Each participant keeps the dog they have made.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/haryung-lee-workshop.png',
        alt: {
          kr: '이하령 워크숍 대표 이미지',
          en: 'Haryung Lee workshop representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-nick-klein',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '닉 클라인', en: 'Nick Klein' },
    title: { kr: 'IMPOLITE', en: 'IMPOLITE' },
    description: {
      kr: ``.trim(),
      en: `How do politicized cultural economies and dialogues manifest in our artistic material and formalist realities ? How do we define the braided utilities of sharing, spatial dynamism, and collaboration? Where do our preconceived ideas and entitlements become conceptual blind spots and, conversely, when do they become strengths? How does authorship and duration service art on a micro and macro scale, and what economies and markets prosper from these conditions?

Impolite is a workshop course taking place during the period of a week, but for SA–I Festival we will work for only an afternoon session. During the workshop, objects are brought in for the exercises followed by exhibition exercise documentation. At the end of each exercise we will reflect on the micro exhibitions. Do not bring materials that are too precious to you, they will function to antagonize the other objects.

Participants are encouraged and required to bring ready-made sculptures, amplification systems, televisions, lumber, tape, paper, garbage, animals, humans, books, fabrics, instruments, food, and whatever they feel can express their artistic agendas thoroughly.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/nick-klein-impolite-workshop.png',
        alt: {
          kr: '닉 클라인 Impolite 워크숍 사진',
          en: "Nick Klein's Impolite workshop photo",
        },
      },
    ],
  },
  {
    id: 'lecture-audrey-chen',
    type: { kr: '렉쳐', en: 'Lecture' },
    artist: { kr: '오드리 첸', en: 'Audrey Chen' },
    title: { kr: '울림과 신체 기억의 호출', en: 'INVOKING ECHOIC AND PHYSICAL MEMORIES' },
    description: {
      kr: ``.trim(),
      en: `This talk/presentation will touch upon how, through the physicality of Audrey Chen's practice, she tries to bring forth a kind of storytelling without language but conveyed through sound. Chen is a second generation Taiwanese-Chinese American living in Berlin, Germany and a mother of a biracial/bicultural son. Her practice has dealt with and continues to explore the displacement of story and history due to the migration and integration processes, loss and adoption of language, untold stories, how the past can be accessed and traced through inherited and lived experience, and the importance of bringing this kind of sounding reflection and communication into future generations.

Chen activates her instruments, invoking a kind of joint resonant body/space transforming itself in a feedback loop of imagination, touch, vibration, sound and aural sensation. Her practice is deeply intertwined with this act of invocation, calling upon the physical body to remember beyond the limitations of personal memory, beyond a single lifetime into generations past, simultaneously echoing into the present and forwards.

The session will begin with a short performance/demonstration before moving into a talk about her practice. Participants will also listen to music from other projects and discuss their approaches.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/audrey-chen-lecture.png',
        alt: {
          kr: '오드리 첸 렉쳐 대표 이미지',
          en: 'Audrey Chen lecture representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-dianaband',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '다이애나밴드', en: 'dianaband' },
    title: { kr: '', en: '' },
    description: {
      kr: `업데이트 될 예정입니다.`.trim(),
      en: `Will be updated soon.`.trim(),
    },
  },
]

export function getWorkshopDetail(id) {
  return workshopDetails.find((detail) => detail.id === id) || null
}
