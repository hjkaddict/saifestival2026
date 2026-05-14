/** WebP 우선, 구형 브라우저는 JPEG */
export function venuePictureSources(file) {
  const base = `/images/venue/artsitesoje_${file}`
  return { webp: `${base}.webp`, jpeg: `${base}.jpg` }
}

/**
 * 사진 위에 텍스트 오버레이 (imageOverlay)
 * start/end: paragraphs 인덱스 [start, end) — 한·영 동일 개수
 */
export const venueLayout = [
  { type: 'imageOverlay', file: '06', variant: 'bleed', showTitle: true, start: 0, end: 2 },
  { type: 'imageOverlay', file: '02', variant: 'full', showTitle: false, start: 2, end: 4 },
  { type: 'imageOverlay', file: '05', variant: 'tall', showTitle: false, start: 4, end: 6 },
  { type: 'imageOverlay', file: '04', variant: 'full', showTitle: false, start: 6, end: 7 },
  { type: 'imageOverlay', file: '03', variant: 'full', showTitle: false, start: 7, end: 8 },
  { type: 'imageOverlay', file: '01', variant: 'bleed', showTitle: false, start: 8, end: 9 },
]

export const venueIntro = {
  kr: {
    title: '아트사이트 소제',
    imageAlts: {
      '01': '아트사이트 소제 건물 외부 전경',
      '02': '전시 공간과 주변의 관계',
      '03': '골목과 중정을 잇는 공간',
      '04': '광장과 벤치, 휴식 공간',
      '05': '관사 골목과 나무 질감',
      '06': '전시장으로 이어지는 동선',
    },
    paragraphs: [
      '소제동의 복합문화공간 ‘아트사이트 소제’는 시대의 유연한 변화 속에서 그 흐름을 담아내기 위해 기획되었습니다. 주변 건물들과의 대비를 통해 차별화를 두었으며, 콘텐츠에 따라 끊임없이 재해석 가능한 공간을 마련했습니다.',
      '‘아트사이트 소제’는 건축의 경계가 열리는 순간, 전시홀이 담고 있는 콘텐츠가 도시로 확장된다는 개념을 담아 붙여진 이름입니다. 이 공간은 단절된 구조물이 아닌 연속적인 오픈그라운드를 통해, 내부와 외부의 경계를 넘나드는 모습을 보여줍니다. 파사드 패널이 닫히면 내부에는 11H*10W*20L미터, 총 4층 건물 높이의 수직공간이 형성되어 몰입감 있는 경험을 선사합니다.',
      '반대로 파사드가 열리는 순간 내부 공간과 외부가 연결되고, 콘텐츠는 도시로 퍼지기 시작합니다. 이로써 아트사이트 소제의 콘텐츠는 건물 안에만 머무르지 않고 소제동 전체로 넘쳐흐릅니다.',
      '전시관 바로 옆에는 지어진 지 100년이 넘은 오래된 관사들이 모여 있습니다. 관사들이 주거 공간으로 사용되던 시절에는 이웃집 마당을 가로지르거나, 집집마다 거실을 지나다니고, 좁은 골목길을 따라 마을 전체를 자유롭게 돌아다닐 수 있었습니다.',
      '소제동 골목길은 아담한 관사들과 전시 공간을 이어주는 핵심적인 연결 통로입니다. 대동천을 따라 걷다 보면 툭 튀어나온 작은 메탈 캐노피가 신비로운 골목길의 시작점임을 알려줍니다.',
      '그곳에 발을 들여놓으면, 자연스럽게 물 흐르듯 이어지는 긴 골목길을 걷게 됩니다. 카페 입구의 캐노피 아래를 지나자마자 잠시 쉬어가기 좋은 작은 중정이 카페들 사이에 마련되어 있습니다.',
      '캐노피 아래에서 중정으로 연결되는 좁은 길은 카페 안쪽까지 자연스럽게 이어져 있어, 공간 전체가 하나로 이어진 듯한 느낌을 선사합니다.',
      '연이어 도착한 광장에는, 소제동에서 흔히 볼 수 없는 넓고 개방적인 퍼블릭 공간이 마련되어 있습니다. 차가운 느낌의 계단 대신 자연스러운 색감의 나무 벤치를 놓아 주변 풍경을 감상하며 편안하게 쉴 수 있는 공간을 만들었습니다. 광장은 누구나 자유롭게 드나들 수 있는 열린 공간이며, 전시 공간의 일부처럼 활용될 수 있도록 조성되었습니다. 광장부터 시작된 벤치들은 철갑3로까지 이어져 있어, 마치 전시관 건물을 등받이 삼아 대나무 숲을 편안하게 감상할 수 있는 아늑한 휴식 공간을 제공합니다.',
      '아트사이트 소제는 여러 경험을 할 수 있도록 다채로운 요소들이 조화롭게 어우러진 공간입니다. 좁은 길을 따라 안뜰을 지나, 카페에서 잠시 쉬어가며, 광장에서 깊은 생각에 잠기고, 전시장에 도착하는 이 모든 과정이 특별한 여행처럼 느껴지기를 바랍니다.',
    ],
  },
  en: {
    title: 'ARTSITE SOJE',
    imageAlts: {
      '01': 'Exterior of ARTSITE SOJE',
      '02': 'Exhibition space in context',
      '03': 'Alley and courtyard connection',
      '04': 'Public square and benches',
      '05': 'Dormitory lanes and wood texture',
      '06': 'Path toward the exhibition hall',
    },
    paragraphs: [
      'The cultural space ‘ARTSITE SOJE’ in Soje-dong was planned to hold the flexible currents of our time. It stands apart from its surroundings by design, and offers a space that can be reinterpreted again and again as the content changes.',
      'The name “ARTSITE SOJE” reflects the idea that, the moment architecture’s boundary opens, what the exhibition hall holds can spill into the city. Rather than a disconnected object, the project reads as a continuous open ground where inside and outside flow into each other. When the façade panels close, an 11H × 10W × 20L-metre vertical volume—roughly the height of a four-storey building—forms inside, offering a deeply immersive experience.',
      'When the façade opens, interior and exterior connect and content begins to spread into the urban fabric. What happens at ARTSITE SOJE is no longer contained by the building alone; it overflows into Soje-dong as a whole.',
      'Beside the exhibition hall stand old railway dormitories, more than a century old. When they were lived in, neighbours crossed one another’s yards, passed through each other’s living rooms, and wandered the whole village along narrow alleys.',
      'The alleyways of Soje-dong are the main thread linking the modest dormitories to the exhibition space. Walking along Daedongcheon, a small metal canopy suddenly appears, marking the threshold into a more mysterious lane.',
      'Step inside and you follow a long alley that flows like water. Just past the café canopies, a small courtyard between the cafés offers a place to pause.',
      'The narrow path from under the canopy into the courtyard continues naturally into the cafés, so the whole sequence feels like one continuous space.',
      'Beyond that lies a square—a wide, open public space rarely found in Soje-dong. Instead of cold stone steps, wooden benches in natural tones invite people to rest while taking in the surroundings. The square is open to everyone and can read as an extension of the exhibition. Benches run from the square all the way to Cheolgap 3-ro, so you can lean back against the exhibition building and quietly enjoy the bamboo grove.',
      'ARTSITE SOJE brings many kinds of experience together in one harmonious place. We hope the whole journey—along the narrow path, through the courtyard, pausing at a café, lingering in the square, and finally arriving at the exhibition hall—feels like a small, memorable trip.',
    ],
  },
}

export function buildVenueBlocks(lang) {
  const intro = venueIntro[lang] || venueIntro.en
  const alt = (file) => intro.imageAlts[file] || ''

  return venueLayout.map((block) => {
    if (block.type === 'imageOverlay') {
      const { webp, jpeg } = venuePictureSources(block.file)
      return {
        type: 'imageOverlay',
        variant: block.variant,
        srcWebp: webp,
        srcJpeg: jpeg,
        alt: alt(block.file),
        showTitle: Boolean(block.showTitle),
        title: intro.title,
        paragraphs: intro.paragraphs.slice(block.start, block.end),
      }
    }
    return block
  })
}
