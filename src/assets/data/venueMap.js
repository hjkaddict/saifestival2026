/** ARTSITE SOJE (아트사이트 소제) — 공유 링크의 place 좌표 (!3d / !4d) */
export const defaultVenueCenter = { lat: 36.3340903, lng: 127.4379985 }

/** 링크 줌(~20)에 맞춰 가깝게 보이도록 기본값 */
export const defaultVenueZoom = 18

/** 외부 길찾기 링크 */
export const venueDirectionsUrl = 'https://maps.app.goo.gl/cL431QCj7vrQj2CU6'

/** 지도 위 카드 문구 */
export const venuePlaceInfo = {
  kr: {
    title: '아트사이트 소제',
    subtitle: '복합문화공간',
    addressLines: ['대전광역시 동구 철갑 3길 17', '대전역 도보 10분'],
    directionsLabel: '길 찾기',
  },
  en: {
    title: 'ARTSITE SOJE',
    subtitle: 'A Cultural Space',
    addressLines: [
      '17 Cheolgap 3-gil, Dong-gu',
      'Daejeon, South Korea',
      '10-min walk from Daejeon Station',
    ],
    directionsLabel: 'Get directions',
  },
}

/** 흑백에 가깝게: 전역 채도 제거 */
export const venueGrayscaleMapStyles = [{ featureType: 'all', stylers: [{ saturation: -100 }] }]
