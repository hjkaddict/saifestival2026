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
      kr: '즉흥과 기보 음악 사이, 들리지 않았던 소리 탐구',
      en: 'Between improvisation and written music, exploring sounds unheard',
    },
    description: {
      kr: `에릭 웡은 참가자들에게 반델바이저 작곡가들의 작품을 소개한다. 이 작품들은 악보에 쓰인 것뿐 아니라 각 공연을 둘러싼 조건, 즉 공간의 소리, 다른 연주자가 만들어내는 소리, 관객의 존재, 때로는 연주자 자신이 지각하는 내적 소리까지 함께 다룬다. 많은 작품은 긴 지속 시간과 침묵에 대한 강한 강조를 특징으로 한다.

이 워크숍에서 웡과 참가자들은 악보를 함께 읽고 수행한다. 새로운 접근을 찾는 즉흥 음악가와 퍼포머, 소리를 구성하는 다른 방식을 탐구하는 작곡가, 즉흥의 여지를 남겨두는 기보 음악에 호기심이 있는 비전문 음악가 모두에게 열려 있다.

참가자는 악기, 목소리, 또는 사운드 생성 앱을 준비해 오는 것을 권장한다.`.trim(),
      en: `Eric Wong will present to interested participants a selection of compositions by Wandelweiser composers, whose work attends not only to what is written in the score, but also to the conditions surrounding each performance. This includes room tone, sounds produced by other performers, the presence of the audience, and, at times, the internal sounds perceived by the performers themselves. Many of these works are characterized by extended durations and a strong emphasis on silence.

In this workshop, Wong and participants will study and work through the scores together. The session is open to improvising musicians and performers who are seeking new approaches, composers interested in alternative ways of shaping sound, and non-professional musicians who are curious about written music that leaves space for improvisation.

Participants are recommended to bring a musical instrument to the workshop, which includes voice or sound generating apps.`.trim(),
    },
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
    title: { kr: '워크숍', en: 'Workshop' },
    description: {
      kr: `우롱라디오는 참여자들과 함께 모듈형 구조물을 제작하며, 듣기와 기록, 송출, 제작이 서로 연결되는 방식을 워크숍의 형식 안에서 다룬다.`.trim(),
      en: `oolongradio works with participants to build modular structures, approaching listening, recording, transmission, and making as connected practices within the format of a workshop.`.trim(),
    },
  },
  {
    id: 'lecture-evol',
    type: { kr: '렉쳐', en: 'Lecture' },
    artist: { kr: '록 히메네즈 데 시스네로스/이볼', en: 'Roc Jimenez de Cisneros/EVOL' },
    title: { kr: '무제의 드럼 순열', en: 'Untitled Drum Permutations' },
    description: {
      kr: `이 렉쳐는 단순하지만 압도적인 전제, 즉 열한 개의 드럼 머신 사운드가 가질 수 있는 모든 배열을 연주하는 작업을 소개한다. 3,900만 개가 넘는 고유한 순열을 다루며, Roland TR-909의 상징적인 사운드를 사용한다. 이 작업은 한계, 반복, 패턴의 변형, 주의에 대한 체계적이면서도 이상할 만큼 명상적인 탐구가 된다.`.trim(),
      en: `This talk presents a piece built around a simple but overwhelming premise: playing every possible ordering of eleven drum machine sounds — over 39 million unique permutations. Using the iconic sounds of the Roland TR-909, the work becomes a systematic yet strangely meditative exploration of limits, repetition, pattern deformation, and attention.`.trim(),
    },
  },
  {
    id: 'workshop-haryung-lee',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '이하령', en: 'Haryung Lee' },
    title: { kr: '워크숍', en: 'Workshop' },
    description: {
      kr: `이하령은 페스티벌 장소 인근에서 수집한 스티로폼 상자로 강아지 형태의 조각을 만드는 워크숍을 진행한다.`.trim(),
      en: `Haryung Lee leads a workshop in which participants make dog-shaped sculptures from styrofoam boxes collected near the festival venue.`.trim(),
    },
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
