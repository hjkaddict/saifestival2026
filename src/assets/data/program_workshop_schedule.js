export const workshopSchedule = [
  {
    id: 'workshop-0712',
    dateLabel: { kr: '7월 12일 (일)', en: 'JUL 12 (SUN)' },
    entries: [
      {
        id: 'workshop-tuukka-laurila-0712',
        time: { kr: '오후 1시 - 6시', en: '1pm - 6pm' },
        detailId: 'workshop-tuukka-laurila-open',
      },
    ],
  },
  {
    id: 'workshop-0713',
    dateLabel: { kr: '7월 13일 (월)', en: 'JUL 13 (MON)' },
    entries: [
      {
        id: 'workshop-eric-wong-0713',
        time: { kr: '오후 1시 - 3시', en: '1pm - 3pm' },
        detailId: 'workshop-eric-wong',
      },
      {
        id: 'workshop-tuukka-laurila-0713',
        time: { kr: '오후 4시 - 8시', en: '4pm - 8pm' },
        detailId: 'workshop-tuukka-laurila-session-1',
      },
    ],
  },
  {
    id: 'workshop-0714',
    dateLabel: { kr: '7월 14일 (화)', en: 'JUL 14 (TUE)' },
    entries: [
      {
        id: 'workshop-oolongradio-0714',
        time: { kr: '오후 1시 - 3시', en: '1pm - 3pm' },
        detailId: 'workshop-oolongradio',
      },
      {
        id: 'workshop-tuukka-laurila-0714',
        time: { kr: '오후 4시 - 8시', en: '4pm - 8pm' },
        detailId: 'workshop-tuukka-laurila-session-2',
      },
    ],
  },
  {
    id: 'workshop-0715',
    dateLabel: { kr: '7월 15일 (수)', en: 'JUL 15 (WED)' },
    entries: [
      {
        id: 'lecture-evol-0715',
        time: { kr: '오후 2시 - 3시', en: '2pm - 3pm' },
        detailId: 'lecture-evol',
      },
      {
        id: 'workshop-haryung-lee-0715',
        time: { kr: '오후 5시 - 7시', en: '5pm - 7pm' },
        detailId: 'workshop-haryung-lee',
      },
    ],
  },
  {
    id: 'workshop-0716',
    dateLabel: { kr: '7월 16일 (목)', en: 'JUL 16 (THU)' },
    entries: [
      {
        id: 'workshop-nick-klein-0716',
        time: { kr: '오후 12시 - 3시', en: '12pm - 3pm' },
        detailId: 'workshop-nick-klein',
      },
      {
        id: 'lecture-audrey-chen-0716',
        time: { kr: '오후 3시 30분 - 5시 30분', en: '3:30pm - 5:30pm' },
        detailId: 'lecture-audrey-chen',
      },
      {
        id: 'workshop-dianaband-0716',
        time: { kr: '오후 6시 - 8시', en: '6pm - 8pm' },
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
      kr: '즉흥과 작곡 사이: 들리지 않는 소리 탐구',
      en: 'BETWEEN IMPROVISATION AND WRITTEN MUSIC, EXPLORING SOUNDS UNHEARD',
    },
    description: {
      kr: `참여자들은 반델바이저 악파 선집을 들으며 단순히 악보에 쓰인 것 뿐만이 아니라 각 악곡의 실연 조건에 대해서도 생각해 보는 시간을 갖습니다. 이러한 조건은 연주 공간의 톤, 연주자들이 내는 다른 소리들, 관중의 존재, 그리고 연주자들의 머리 속에서만 존재하는 소리들을 포함하고 있습니다. 반델바이저 악파의 많은 악곡은 장시간 동안 지속되며 침묵이 강조되는 특징을 가집니다. 

본 워크샵에서 에릭 웡은 참여자들과 이 악곡들을 탐구해보는 시간을 갖습니다. 새로운 접근 방식을 시도해보고자 하는 즉흥 음악가 및 연주자, 소리를 형성하는 대안적인 방식에 관심이 있는 작곡가, 그리고 즉흥 연주의 여지를 남기는 작곡 방식에 흥미가 있는 비전문 음악인들 모두에게 열려 있습니다. 

본 워크샵에는 참여자가 각자 자신의 악기를 가져오도록 권장하고 있습니다. 노래, 사운드 생성 앱 등의 활용도 가능합니다.
`.trim(),
      en: `Eric Wong will present to interested participants a selection of compositions by Wandelweiser composers, whose work attends not only to what is written in the score, but also to the conditions surrounding each performance. This includes room tone, sounds produced by other performers, the presence of the audience, and, at times, the internal sounds perceived by the performers themselves. Many of these works are characterized by extended durations and a strong emphasis on silence.
      
In this workshop, Wong and participants will study and work through the scores together. The session is open to improvising musicians and performers who are seeking new approaches, composers interested in alternative ways of shaping sound, and non-professional musicians who are curious about written music that leaves space for improvisation.
      
Participants are recommended to bring a musical instrument to the workshop, which includes voice or sound generating apps.`.trim(),
    },
    rsvpUrl: 'https://forms.gle/P9QAGdjDoZsvqJYm6',
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
    id: 'workshop-tuukka-laurila-open',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '투카 라우리라', en: 'Tuukka Laurila' },
    title: { kr: '오픈 워크숍: 임시 스튜디오', en: 'OPEN WORKSHOP: TEMPORARY STUDIO' },
    description: {
      kr: `투카 라우리라의 공개 워크숍은 현장에서 수집한 폐건축 자재로 구축하는 ‘살아있는 공간'이라는 프로젝트의 일환으로, 3일간 진행됩니다. 

참여자들은 함께 자재를 모으고 분류하고 쌓아 나가면서 임시 구조물을 만듭니다. 이렇게 만들어진 구조물은 변형 가능한 것으로, 최종적으로는 재활용될 것입니다.

라우리라에게 있어, 작업이란 곧 과정입니다. 구조물 짓기라는 행위와 그 속에서 일어나는 교류를 통해 형성되는 임시 공동체는 오늘날 물질주의적인 세상이 추구하는 끊임없는 새로움에 맞선 저항의 실마리를 제시하고 있습니다.  
`.trim(),
      en: `Open workshop sessions at SA-I Festival with Paris-based artist Tuukka Laurila will take place over three days as part of an ongoing "living environment" constructed from locally sourced found and discarded building materials.

Throughout the workshop, materials will be collectively gathered, sorted, and gradually assembled into temporary structures that remain open to modification, and in the end, return to existing cycles of reuse.

For Laurila, the process is the work: a temporary community formed through building and exchange, within a space that is a proposition against the perpetual newness of today's material world.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/tuukka-laurila-workshop.png',
        alt: {
          kr: '투카 라우리라 워크숍 대표 이미지',
          en: 'Tuukka Laurila workshop representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-tuukka-laurila-session-1',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '투카 라우리라', en: 'Tuukka Laurila' },
    title: { kr: '임시 스튜디오 (1부)', en: 'TEMPORARY STUDIO (SESSION 1)' },
    description: {
      kr: `투카 라우리라의 공개 워크숍은 현장에서 수집한 폐건축 자재로 구축하는 ‘살아있는 공간'이라는 프로젝트의 일환으로, 3일간 진행됩니다. 

참여자들은 함께 자재를 모으고 분류하고 쌓아 나가면서 임시 구조물을 만듭니다. 이렇게 만들어진 구조물은 변형 가능한 것으로, 최종적으로는 재활용될 것입니다.

라우리라에게 있어, 작업이란 곧 과정입니다. 구조물 짓기라는 행위와 그 속에서 일어나는 교류를 통해 형성되는 임시 공동체는 오늘날 물질주의적인 세상이 추구하는 끊임없는 새로움에 맞선 저항의 실마리를 제시하고 있습니다.  
`.trim(),
      en: `Open workshop sessions at SA-I Festival with Paris-based artist Tuukka Laurila will take place over three days as part of an ongoing "living environment" constructed from locally sourced found and discarded building materials.

Throughout the workshop, materials will be collectively gathered, sorted, and gradually assembled into temporary structures that remain open to modification, and in the end, return to existing cycles of reuse.

For Laurila, the process is the work: a temporary community formed through building and exchange, within a space that is a proposition against the perpetual newness of today's material world.`.trim(),
    },
    rsvpUrl: 'https://forms.gle/MKSEWtqEc41oyv3r5',
    images: [
      {
        src: '/images/workshops/tuukka-laurila-workshop.png',
        alt: {
          kr: '투카 라우리라 워크숍 대표 이미지',
          en: 'Tuukka Laurila workshop representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-tuukka-laurila-session-2',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '투카 라우리라', en: 'Tuukka Laurila' },
    title: { kr: '임시 스튜디오 (2부)', en: 'TEMPORARY STUDIO (SESSION 2)' },
    description: {
      kr: `투카 라우리라의 공개 워크숍은 현장에서 수집한 폐건축 자재로 구축하는 ‘살아있는 공간'이라는 프로젝트의 일환으로, 2일간 진행됩니다. 

참여자들은 함께 자재를 모으고 분류하고 쌓아 나가면서 임시 구조물을 만듭니다. 이렇게 만들어진 구조물은 변형 가능한 것으로, 최종적으로는 재활용될 것입니다.

라우리라에게 있어, 작업이란 곧 과정입니다. 구조물 짓기라는 행위와 그 속에서 일어나는 교류를 통해 형성되는 임시 공동체는 오늘날 물질주의적인 세상이 추구하는 끊임없는 새로움에 맞선 저항의 실마리를 제시하고 있습니다.  
`.trim(),
      en: `Open workshop sessions at SA-I Festival with Paris-based artist Tuukka Laurila will take place over two days as part of an ongoing "living environment" constructed from locally sourced found and discarded building materials.

Throughout the workshop, materials will be collectively gathered, sorted, and gradually assembled into temporary structures that remain open to modification, and in the end, return to existing cycles of reuse.

For Laurila, the process is the work: a temporary community formed through building and exchange, within a space that is a proposition against the perpetual newness of today's material world.`.trim(),
    },
    rsvpUrl: 'https://forms.gle/MKSEWtqEc41oyv3r5',
    images: [
      {
        src: '/images/workshops/tuukka-laurila-workshop.png',
        alt: {
          kr: '투카 라우리라 워크숍 대표 이미지',
          en: 'Tuukka Laurila workshop representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-oolongradio',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '우롱라디오', en: 'oolongradio' },
    title: { kr: '그늘 속으로 들어가라', en: 'PUT YOURSELF IN THE SHADE' },
    description: {
      kr: `우롱라디오의 '그늘 속으로 들어가라' 워크숍에서는 모듈 패널과 플라스틱 조인트, 테이프를 이용해 공간을 가로지르는 긴 구조물을 워크숍 참여자들과 함께 만들어봅니다.
`.trim(),
      en: `In oolongradio's 'Put yourself in the Shade workshop', participants will build together a long structure that spans from one end of the workshop space to the other with modular panels, plastic joints, and tapes.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/oolongradio-workshop.png',
        alt: {
          kr: '우롱라디오 워크숍 대표 이미지',
          en: 'oolongradio workshop representative image',
        },
      },
    ],
  },
  {
    id: 'lecture-evol',
    type: { kr: '강연', en: 'Lecture' },
    artist: { kr: '록 히메네스 데 시스네로스/이볼', en: 'Roc Jiménez de Cisneros/EVOL' },
    title: { kr: '타악기 변형 무제 ', en: 'UNTITLED DRUM PERMUTATIONS' },
    description: {
      kr: `본 발표에서는 “드럼머신 소리 열한 가지로 만들 수 있는 모든 배열을 연주하기”라는, 다소 단순하면서도 어마어마한—총 3백9십만가지의 변형이 가능합니다—전제를 바탕으로 만들어진 작품을 선보입니다. 롤란드 TR-909의 시그내쳐 사운드를 활용하여 체계적인 동시에 묘하게 명상적인 방식으로 한계, 반복, 패턴 왜곡, 그리고 집중도에 대해 탐구하고자 합니다. `.trim(),
      en: `This talk presents a piece built around a simple but overwhelming premise: playing every possible ordering of eleven drum machine sounds — over 39 million unique permutations. Using the iconic sounds of the Roland TR-909, the work becomes a systematic yet strangely meditative exploration of limits, repetition, pattern deformation, and attention.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/roc-jimenez-evol-lecture.png',
        alt: {
          kr: '록 히메네스 데 시스네로스/이볼 강연 대표 이미지',
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
      en: `Take a walk around Jungang-dong and pick up a styrofoam box. Gather back at the venue with the collected styrofoam boxes. Cut four corners of the box using a hot wire cutter to shape them into a dog. Everyone keeps the dog they made.`.trim(),
    },
    rsvpUrl: 'https://forms.gle/Q2QvL1XL1GPgHkhf6',
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
    title: { kr: '무례', en: 'IMPOLITE' },
    description: {
      kr: `정치화된 문화 경제와 교류는 어떤 방식으로 현실 속의 예술적 재료와 형식을 통하여 발현될까요? 나눔, 역동의 공간, 그리고 협업 등의 ‘쓸모'를 어떻게 정의할 수 있을까요? 우리가 가진 선입견과 권리 의식은 어떨 때 약점이 되고 어떨 때 강점이 될 수 있을까요? 작가의 주체성과 ‘듀레이션(duration)'은 예술과 어떤 관계에 놓여있고, 이러한 관계를 바탕으로 조성되는 경제적 조건과 시장 환경은 어떤 모습일까요? 

〈무례〉는 원래 일주일 동안 진행되는 워크숍이지만, 사–이 페스티벌에서는 오후 한 차례의 세션으로 압축해 진행됩니다. 참여자는 ‘연습 전시'에 사용할 물건을 각자 가져와야 하며, 워크숍은 ‘연습 전시'와 이에 대한 기록 작업으로 구성되어 있습니다. 워크숍 마무리 시간에는 참여자들이 자신들이 조성한 작은 전시를 돌아보고 성찰하는 시간을 갖습니다.

연습 전시에 사용될 물건을 가져오는 것은 필수 요건으로, 자신의 예술적 아젠다를 온전히 표현할 수 있다고 생각하는 것이라면 무엇이든 좋습니다(기성품, 앰프, 텔레비전, 목재, 테이프, 종이, 폐품, 동물, 사람, 책, 천, 악기, 음식 등). 다만, 귀중품은 가져오지 마실 것을 권장드립니다. 
`.trim(),
      en: `How do politicized cultural economies and dialogues manifest in our artistic material and formalist realities ? How do we define the braided utilities of sharing, spatial dynamism, and collaboration? Where do our preconceived ideas and entitlements become conceptual blind spots and, conversely, when do they become strengths? How does authorship and duration service art on a micro and macro scale, and what economies and markets prosper from these conditions?

Impolite is a workshop course taking place during the period of a week, but for SA–I Festival we will work for only an afternoon session. During the workshop, objects are brought in for the exercises followed by exhibition exercise documentation. At the end of each exercise we will reflect on the micro exhibitions. Do not bring materials that are too precious to you, they will function to antagonize the other objects.

Participants are encouraged and required to bring ready-made sculptures, amplification systems, televisions, lumber, tape, paper, garbage, animals, humans, books, fabrics, instruments, food, and whatever they feel can express their artistic agendas thoroughly.`.trim(),
    },
    rsvpUrl: 'https://forms.gle/YKaJkXdepVndXYmA9',
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
    type: { kr: '강연', en: 'Lecture' },
    artist: { kr: '오드리 첸', en: 'Audrey Chen' },
    title: { kr: '메아리와 몸의 기억', en: 'INVOKING ECHOIC AND PHYSICAL MEMORIES' },
    description: {
      kr: `본 발표는 언어가 아닌 소리를 통하여 서사를 전달하는 방식에 관한 것입니다. 저는 베를린에 살고 있는 2세대 대만계 미국인이며, 혼혈인 아들을 둔 어머니입니다. 제 작업은 이주와 동화 과정에서 상실되는 서사와 역사를 다루고 있으며, 언어의 상실과 적응, 숨겨진 이야기, 과거 경험의 양상, 소리를 통한 사유와 소통 방식이 미래 세대에가 가지는 중요한 함의 등의 주제도 포함하고 있습니다. 공연에서 저는 접합된 공명체가 상상, 접촉, 진동, 청각이라는 피드백 루프 속에서 변형되는 과정을 표현하는 방식으로 악기를 사용합니다. 물리적인 신체로 하여금 기억을 넘어선 것을 기억하도록 만드는 과정은 제 작업에서 매우 중요한 요소로, 이는 현생으로부터 과거의 세대로, 그리고 현재로부터 미래로 울리는 메아리로서 규정될 수 있습니다.

“본 발표는 언어가 아닌 소리를 통하여 서사를 전달하는 방식에 관한 것으로, 처음에는 짧은 공연을 선보이며 이후에는 작업에 대한 발표가 이어집니다. 또한, 다른 이들의 작품도 청취하고 그들의 접근 방식에 대해서 논의합니다.”
`.trim(),
      en: `This talk/presentation will touch upon how, through the physicality of Audrey Chen's practice, she tries to bring forth a kind of storytelling without language but conveyed through sound. Chen is a second generation Taiwanese-Chinese American living in Berlin, Germany and a mother of a biracial/bicultural son. Her practice has dealt with and continues to explore the displacement of story and history due to the migration and integration processes, loss and adoption of language, untold stories, how the past can be accessed and traced through inherited and lived experience, and the importance of bringing this kind of sounding reflection and communication into future generations.

Chen activates her instruments, invoking a kind of joint resonant body/space transforming itself in a feedback loop of imagination, touch, vibration, sound and aural sensation. Her practice is deeply intertwined with this act of invocation, calling upon the physical body to remember beyond the limitations of personal memory, beyond a single lifetime into generations past, simultaneously echoing into the present and forwards.

The session will begin with a short performance/demonstration before moving into a talk about her practice. Participants will also listen to music from other projects and discuss their approaches.`.trim(),
    },
    images: [
      {
        src: '/images/workshops/audrey-chen-lecture.png',
        alt: {
          kr: '오드리 첸 강연 대표 이미지',
          en: 'Audrey Chen lecture representative image',
        },
      },
    ],
  },
  {
    id: 'workshop-dianaband',
    type: { kr: '워크숍', en: 'Workshop' },
    artist: { kr: '다이애나밴드', en: 'dianaband' },
    title: { kr: '듣기-만들기를 위한 만들기-듣기', en: 'MAKING-LISTENING FOR LISTENING-MAKING' },
    description: {
      kr: `듣기-만들기는 일종의 피드백 루프입니다. 이 둘은 서로가 서로의 기반이므로 상대방을 완전히 전복시킬 힘을 가집니다. 상호간에 흐르는 에너지의 방향도 규정하기 어렵습니다. 우리는 듣기를 만듭니다. 듣기 위해서 만들기도 하고, 만들어진 것이 우리를 듣게하기도 하고, 들리는 것이 곧 만들어짐 그 자체이기도 하고, 듣기는 이 모든 상태들이 우리의 마음 안에서 만들어내는 풍광이기도 합니다.

이 모임에서 우리는 움직이거나 변화하는 듣기-존재들을 만듭니다. 이들은 우리들과의 관계를 통해 태어나지만, 동시에 독립된 행위주체로서 그들만의 연립된 세계를 구축하게 됩니다. 워크숍 참여자들은 여럿이서 여럿을 만들고, 이 여럿의 세계를 함께 듣기함으로서 듣기-만들기를 일단락합니다.

참여자 분들께는 간단한 모터 장치와 배터리 및 네트워크 장치를 준비해드립니다. 공간에서 발견하고 싶은 '듣기'를 찾거나, 우연히 만들어지는 움직임 속에서 신체를 연상시키는 '듣기'를 발견하거나 하며, 만들기-듣기가 이끌어가는 방향으로 주변 사물들(found object) 혹은 채집된 자연물들 혹은 그외에 무엇이든지 이용하여서, 우리에 의한 우리-듣기를 함께 만들어 봅시다.
`.trim(),
      en: `Listening-making is a type of feedback loop. The two are constitutive of one another, which entails that each has the power to subvert another. We make an act of listening. We make something for listening, and sometimes something that has been made makes us listen. Being listened to can be synonymous with being made. Listening is a landscape in our mind created by all of these different states.

In this workshop, participants will create listening-beings that change and are mobile. While they are created from our exchange, they are also independent from us, constructing a serialized world that consists only of themselves. The workshop will conclude by listening together to the world shaped by such multiplicity. 

Participants will be provided with a simple motor device, a battery, and a network device. We may search for something specific to listen to in the space; or discover by chance a 'listening' created by spontaneous movements that evokes the human body. Whichever the case, we will follow where the process of making-listening leads. Using found objects, collecting materials from nature, etc., together we will create a collective listening by us, for us.
`.trim(),
    },
    rsvpUrl: 'https://forms.gle/oSWa6qLxgWxLF5DRA',
    images: [
      {
        src: '/images/workshops/dianaband-workshop.png',
        alt: {
          kr: '다이애나밴드 워크숍 대표 이미지',
          en: 'dianaband workshop representative image',
        },
      },
    ],
  },
]

export function getWorkshopDetail(id) {
  return workshopDetails.find((detail) => detail.id === id) || null
}
