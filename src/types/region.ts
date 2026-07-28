/**
 * 전국 행정구역 시·군·구 및 시·도 인터페이스 정의
 */
export interface Region {
  id: string; // 고유 slug ID (예: "gyeonggi-suwon", "seoul-gangnam", "busan-haeundae")
  sido: string; // 시·도 명칭 (예: "경기도", "서울특별시")
  sigungu: string; // 시·군·구 명칭 (예: "수원시", "강남구")
  displayName: string; // UI에 표시할 시·군·구 명칭 (예: "수원시", "강남구")
  fullName: string; // 전체 행정구역 명칭 (예: "경기도 수원시", "서울특별시 강남구")
  latitude: number; // 대표 관측 위도
  longitude: number; // 대표 관측 경도
}

export interface Province {
  id: string; // 시·도 slug ID (예: "seoul", "gyeonggi")
  name: string; // 시·도 정식 명칭 (예: "서울특별시", "경기도")
  regions: Region[];
}
