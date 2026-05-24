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
        time: { kr: '오후 12시 - 오후 2시', en: '12PM - 2PM' },
        detailId: 'workshop-nick-klein',
      },
      {
        id: 'lecture-audrey-chen-0716',
        time: { kr: '오후 2시 - 오후 4시', en: '2PM - 4PM' },
        detailId: 'lecture-audrey-chen',
      },
      {
        id: 'workshop-dianaband-0716',
        time: { kr: '오후 4시 - 오후 7시', en: '4PM - 7PM' },
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
      en: 'Between improvisation and written music, exploring sounds unheard',
    },
    description: {
      kr: `에릭 웡(Eric Wong)은 워크숍의 참여자들에게 반델바이저(Wandelweiser) 작곡가들의 선별된 작품을 소개할 예정입니다. 이 작곡가들의 음악은 악보에 적힌 내용뿐만 아니라 각 공연을 둘러싼 환경적 조건에도 주목합니다. 여기에는 공간의 울림, 다른 연주자들이 만들어내는 소리, 관객의 존재, 그리고 때로는 연주자 자신이 내면에서 감지하는 소리까지 포함됩니다. 이 작품들의 상당수는 긴 지속 시간과 침묵에 대한 강한 강조를 특징으로 합니다.
      
이 워크숍에서 웡과 참가자들은 함께 악보를 살펴보고 연구할 것입니다. 이러한 세션은 새로운 접근 방식을 모색하는 즉흥 연주자 및 퍼포머, 소리를 형성하는 새로운 방식에 관심 있는 작곡가, 그리고 즉흥 연주의 여지를 남기는 악보 음악에 호기심을 가진 비전문 음악가 모두에게 열려 있습니다.
      
참가자들은 워크숍에 악기를 지참하시길 권장하며, 여기에는 목소리나 소리를 생성하는 앱도 포함됩니다.`.trim(),
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
    title: { kr: '워크숍', en: 'Workshop' },
    description: {
      kr: `투카 라우리라는 참여자들과 함께 전시장 내부의 구조를 지속적으로 수정하고 확장하는 워크숍을 진행한다. 이 과정은 그의 전시 작업에서 이어지는 재료의 수집, 분류, 조립을 중심으로 이루어진다.`.trim(),
      en: `Tuukka Laurila leads a workshop in which participants continuously modify and expand the internal structure of the exhibition space, centering on processes of collecting, sorting, and assembling materials that extend from his exhibition work.`.trim(),
    },
  },
  {
    id: 'workshop-oolongradio',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '우롱라디오', en: 'oolongradio' },
    title: { kr: 'Put yourself in the shade', en: 'Put yourself in the shade' },
    description: {
      kr: `업데이트 될 예정입니다.`.trim(),
      en: `Will be updated soon.`.trim(),
    },
  },
  {
    id: 'lecture-evol',
    type: { kr: '렉쳐', en: 'Lecture' },
    artist: { kr: '록 히메네즈 데 시스네로스/이볼', en: 'Roc Jimenez de Cisneros/EVOL' },
    title: { kr: '무제의 드럼 순열', en: 'Untitled Drum Permutations' },
    description: {
      kr: `이 강연은 단순하지만 압도적인 전제를 바탕으로 만들어진 작업을 소개합니다. 열한 가지 드럼 머신 사운드를 가능한 모든 순서로 재생하는 것, 즉 3,900만 개가 넘는 고유한 순열을 전부 연주하는 것입니다. 롤랜드 TR-909의 상징적인 사운드들을 사용한 이 작품은 한계, 반복, 패턴의 변형, 그리고 주의(注意)에 대한 체계적이면서도 묘한 명상적인 탐구입니다.`.trim(),
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
    title: { kr: '자급자족', en: 'Self-Sufficient' },
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
    title: { kr: 'Impolite', en: 'Impolite' },
    description: {
      kr: `닉 클라인은 참여자들이 각자 오브젝트를 가져와 즉흥적인 전시를 만들고 기록하는 집단 워크숍을 구성한다.`.trim(),
      en: `Nick Klein organizes a collective workshop in which participants bring objects to create and document an improvised exhibition.`.trim(),
    },
  },
  {
    id: 'lecture-audrey-chen',
    type: { kr: '렉쳐', en: 'Lecture' },
    artist: { kr: '오드리 첸', en: 'Audrey Chen' },
    title: { kr: '울림과 신체 기억의 호출', en: 'Invoking Echoic and Physical Memories' },
    description: {
      kr: `이 토크/프레젠테이션은 오드리 첸이 자신의 실천의 신체성을 통해 언어 없이, 그러나 소리를 통해 전달되는 일종의 서사를 어떻게 불러내려 하는지를 다룬다. 그는 베를린에 거주하는 2세대 타이완계-중국계 미국인이자 혼혈/다문화적 배경을 가진 아들의 어머니이다. 그의 작업은 이주와 통합의 과정, 언어의 상실과 채택, 말해지지 않은 이야기, 그리고 과거가 어떻게 상속된 경험과 살아낸 경험을 통해 접근되고 추적될 수 있는지를 탐구해왔다.

첸은 악기를 활성화하며 상상, 접촉, 진동, 소리, 청각적 감각의 피드백 루프 안에서 몸과 공간이 함께 공명하는 상태를 호출한다. 그의 실천은 이 호출의 행위와 깊이 얽혀 있으며, 자신의 신체가 개인의 기억과 생애를 넘어 과거 세대까지 기억하고, 동시에 현재와 미래 세대로 울려 퍼지도록 한다.

세션은 짧은 퍼포먼스/시연으로 시작한 뒤 그의 작업에 관한 토크로 이어진다. 또한 다른 프로젝트의 음악을 함께 듣고 각각의 접근 방식에 대해 이야기한다.`.trim(),
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
    title: { kr: '워크숍', en: 'Workshop' },
    description: {
      kr: `다이애나밴드는 라디오와 분산된 청취 환경을 활용한 워크숍을 진행하며, 관계-듣기와 네트워크를 통해 인간 감각 너머의 관계를 탐구한다.`.trim(),
      en: `dianaband conducts a workshop using radio and distributed listening environments, exploring relations beyond human perception through relational listening and networks.`.trim(),
    },
  },
]

export function getWorkshopDetail(id) {
  return workshopDetails.find((detail) => detail.id === id) || null
}
