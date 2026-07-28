/**
 * 확장된 도시 및 시·도 행정구역 도메인 타입 정의
 */
export interface City {
  id: string;
  name: string; // 정식 행정구역명 (예: "서울특별시", "경기도")
  shortName: string; // 축약 명칭 및 검색 키워드 (예: "서울", "경기")
  representativeCity?: string; // 도 단위 지역의 대표 관측 도시 (예: "수원", "춘천")
  latitude: number;
  longitude: number;
  category: 'metropolitan' | 'province'; // 특별시/광역시/특별자치시 vs 도 단위 구분
}
