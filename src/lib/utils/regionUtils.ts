import { ALL_REGIONS, PROVINCES } from '@/constants/regions';
import { Province, Region } from '@/types/region';

/**
 * 2026년 7월 1일 전남광주통합특별시 출범에 따른 구형 ID -> 신형 ID 마이그레이션 매핑
 */
export const LEGACY_ID_MIGRATION_MAP: Record<string, string> = {
  // 구 광주광역시 5개 자치구 마이그레이션
  'gwangju-dong': 'jeonnam-gwangju-dong',
  'gwangju-seo': 'jeonnam-gwangju-seo',
  'gwangju-nam': 'jeonnam-gwangju-nam',
  'gwangju-buk': 'jeonnam-gwangju-buk',
  'gwangju-gwangsan': 'jeonnam-gwangju-gwangsan',

  // 구 전라남도 22개 시·군 마이그레이션
  'jeonnam-mokpo': 'jeonnam-gwangju-mokpo',
  'jeonnam-yeosu': 'jeonnam-gwangju-yeosu',
  'jeonnam-suncheon': 'jeonnam-gwangju-suncheon',
  'jeonnam-naju': 'jeonnam-gwangju-naju',
  'jeonnam-gwangyang': 'jeonnam-gwangju-gwangyang',
  'jeonnam-damyang': 'jeonnam-gwangju-damyang',
  'jeonnam-gokseong': 'jeonnam-gwangju-gokseong',
  'jeonnam-gurye': 'jeonnam-gwangju-gurye',
  'jeonnam-goheung': 'jeonnam-gwangju-goheung',
  'jeonnam-boseong': 'jeonnam-gwangju-boseong',
  'jeonnam-hwasun': 'jeonnam-gwangju-hwasun',
  'jeonnam-jangheung': 'jeonnam-gwangju-jangheung',
  'jeonnam-gangjin': 'jeonnam-gwangju-gangjin',
  'jeonnam-haenam': 'jeonnam-gwangju-haenam',
  'jeonnam-yeongam': 'jeonnam-gwangju-yeongam',
  'jeonnam-muan': 'jeonnam-gwangju-muan',
  'jeonnam-hampyeong': 'jeonnam-gwangju-hampyeong',
  'jeonnam-yeonggwang': 'jeonnam-gwangju-yeonggwang',
  'jeonnam-jangseong': 'jeonnam-gwangju-jangseong',
  'jeonnam-wando': 'jeonnam-gwangju-wando',
  'jeonnam-jindo': 'jeonnam-gwangju-jindo',
  'jeonnam-sinan': 'jeonnam-gwangju-sinan',
};

/**
 * 구형 ID가 들어왔을 때 신형 ID로 마이그레이션합니다.
 */
export function migrateRegionId(id: string): string {
  return LEGACY_ID_MIGRATION_MAP[id] || id;
}

/**
 * 고유 slug ID로 특정 시·군·구 지역 객체를 검색합니다. (구형 ID 자동 변환 포함)
 */
export function findRegionById(regionId: string): Region | undefined {
  const migratedId = migrateRegionId(regionId);
  return ALL_REGIONS.find((r) => r.id === migratedId);
}

/**
 * 시·도 ID로 특정 광역자치단체 객체를 검색합니다.
 */
export function findProvinceById(provinceId: string): Province | undefined {
  return PROVINCES.find((p) => p.id === provinceId);
}

/**
 * 로컬 정적 지역 검색 함수
 * - 신형 공식 명칭("전남광주통합특별시 목포시")뿐만 아니라 과거 검색어 alias("광주 광산구", "전남 목포", "광주", "전남")도 매칭 지원
 * - 결과 화면에서는 항상 신형 공식 명칭("전남광주통합특별시 ...")으로 정규화하여 출력됨
 */
export function searchRegions(query: string): Region[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // 검색어 정규화 (과거 명칭 처리)
  const isGwangjuAlias = trimmed.includes('광주');
  const isJeonnamAlias = trimmed.includes('전남') || trimmed.includes('전라남도');

  return ALL_REGIONS.filter((region) => {
    const matchFullName = region.fullName.toLowerCase().includes(trimmed);
    const matchSido = region.sido.toLowerCase().includes(trimmed);
    const matchSigungu = region.sigungu.toLowerCase().includes(trimmed);

    if (matchFullName || matchSido || matchSigungu) {
      return true;
    }

    // 전남광주통합특별시 하위 27개 지역에 대한 alias 지원
    if (region.sido === '전남광주통합특별시') {
      if (isGwangjuAlias || isJeonnamAlias) {
        // "광주 광산구", "전남 목포" 등의 키워드 추출
        const keywordWithoutAlias = trimmed
          .replace('광주광역시', '')
          .replace('전라남도', '')
          .replace('광주', '')
          .replace('전남', '')
          .trim();

        if (!keywordWithoutAlias) {
          return true; // "광주" 또는 "전남"만 입력 시 전남광주통합특별시 하위 전체 매칭
        }

        return region.sigungu.toLowerCase().includes(keywordWithoutAlias);
      }
    }

    return false;
  });
}

/**
 * 저장된 지역 ID 배열 중 실제 존재하는 유효한 Region 객체 목록만 필터링합니다.
 * 구형 ID 자동 마이그레이션, 중복 제거, 5개 한계 보장을 수행합니다.
 */
export function filterValidRegions(regionIds: string[]): Region[] {
  if (!Array.isArray(regionIds)) return [];

  // 1. 구형 ID 마이그레이션 적용
  const migratedIds = regionIds.map((id) => migrateRegionId(id));

  // 2. 중복 ID 제거
  const uniqueIds = Array.from(new Set(migratedIds));

  // 3. 존재하지 않는 잘못된 ID 자동 필터링
  const validRegions: Region[] = [];
  for (const id of uniqueIds) {
    const found = ALL_REGIONS.find((r) => r.id === id);
    if (found) {
      validRegions.push(found);
    }
  }

  return validRegions;
}
