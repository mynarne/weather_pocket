import { City } from '@/types/city';

/**
 * 대한민국 전국 17개 시·도 지역 데이터
 * 도 단위 지역은 대표 관측 도시 좌표(예: 경기도 -> 수원)를 기준으로 설정함.
 * 기존 호환성을 위해 서울, 부산, 대구, 인천, 청주(충북) ID를 그대로 유지함.
 */
export const CITIES: City[] = [
  {
    id: 'seoul',
    name: '서울특별시',
    shortName: '서울',
    latitude: 37.5665,
    longitude: 126.978,
    category: 'metropolitan',
  },
  {
    id: 'busan',
    name: '부산광역시',
    shortName: '부산',
    latitude: 35.1796,
    longitude: 129.0756,
    category: 'metropolitan',
  },
  {
    id: 'daegu',
    name: '대구광역시',
    shortName: '대구',
    latitude: 35.8714,
    longitude: 128.6014,
    category: 'metropolitan',
  },
  {
    id: 'incheon',
    name: '인천광역시',
    shortName: '인천',
    latitude: 37.4563,
    longitude: 126.7052,
    category: 'metropolitan',
  },
  {
    id: 'gwangju',
    name: '광주광역시',
    shortName: '광주',
    latitude: 35.1595,
    longitude: 126.8526,
    category: 'metropolitan',
  },
  {
    id: 'daejeon',
    name: '대전광역시',
    shortName: '대전',
    latitude: 36.3504,
    longitude: 127.3845,
    category: 'metropolitan',
  },
  {
    id: 'ulsan',
    name: '울산광역시',
    shortName: '울산',
    latitude: 35.5384,
    longitude: 129.3114,
    category: 'metropolitan',
  },
  {
    id: 'sejong',
    name: '세종특별자치시',
    shortName: '세종',
    latitude: 36.48,
    longitude: 127.289,
    category: 'metropolitan',
  },
  {
    id: 'gyeonggi',
    name: '경기도',
    shortName: '경기',
    representativeCity: '수원',
    latitude: 37.2636,
    longitude: 127.0286,
    category: 'province',
  },
  {
    id: 'gangwon',
    name: '강원특별자치도',
    shortName: '강원',
    representativeCity: '춘천',
    latitude: 37.8813,
    longitude: 127.7298,
    category: 'province',
  },
  {
    id: 'cheongju', // 기존 cheongju ID 호환유지 (충청북도 청주)
    name: '충청북도',
    shortName: '충북',
    representativeCity: '청주',
    latitude: 36.6424,
    longitude: 127.489,
    category: 'province',
  },
  {
    id: 'chungnam',
    name: '충청남도',
    shortName: '충남',
    representativeCity: '홍성',
    latitude: 36.6012,
    longitude: 126.6608,
    category: 'province',
  },
  {
    id: 'jeonbuk',
    name: '전북특별자치도',
    shortName: '전북',
    representativeCity: '전주',
    latitude: 35.8242,
    longitude: 127.148,
    category: 'province',
  },
  {
    id: 'jeonnam',
    name: '전라남도',
    shortName: '전남',
    representativeCity: '무안',
    latitude: 34.9904,
    longitude: 126.4817,
    category: 'province',
  },
  {
    id: 'gyeongbuk',
    name: '경상북도',
    shortName: '경북',
    representativeCity: '안동',
    latitude: 36.5684,
    longitude: 128.7294,
    category: 'province',
  },
  {
    id: 'gyeongnam',
    name: '경상남도',
    shortName: '경남',
    representativeCity: '창원',
    latitude: 35.228,
    longitude: 128.6811,
    category: 'province',
  },
  {
    id: 'jeju',
    name: '제주특별자치도',
    shortName: '제주',
    representativeCity: '제주',
    latitude: 33.4996,
    longitude: 126.5312,
    category: 'province',
  },
];

/**
 * cityId를 기준으로 도시 객체를 검색하는 헬퍼 함수
 */
export function findCityById(cityId: string): City | undefined {
  return CITIES.find((city) => city.id === cityId);
}
