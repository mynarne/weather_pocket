import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { filterValidRegions, migrateRegionId } from '@/lib/utils/regionUtils';

describe('useFavoriteStore 마이그레이션 및 관심 지역 정책 테스트', () => {
  beforeEach(() => {
    useFavoriteStore.setState({ favoriteRegionIds: [] });
  });

  it('구형 ID(gwangju-gwangsan, jeonnam-mokpo) 추가 시 신형 ID(jeonnam-gwangju-gwangsan, jeonnam-gwangju-mokpo)로 자동 마이그레이션되어야 한다', () => {
    expect(migrateRegionId('gwangju-gwangsan')).toBe('jeonnam-gwangju-gwangsan');
    expect(migrateRegionId('jeonnam-mokpo')).toBe('jeonnam-gwangju-mokpo');

    const store = useFavoriteStore.getState();
    store.addFavorite('gwangju-gwangsan');
    store.addFavorite('jeonnam-mokpo');

    const favIds = useFavoriteStore.getState().favoriteRegionIds;
    expect(favIds).toContain('jeonnam-gwangju-gwangsan');
    expect(favIds).toContain('jeonnam-gwangju-mokpo');
  });

  it('localStorage에 저장된 구형 ID 배열도 filterValidRegions를 통해 신형 Region 객체로 올바르게 복원되어야 한다', () => {
    const legacySavedIds = ['gwangju-gwangsan', 'jeonnam-yeosu', 'invalid-id'];
    const validRegions = filterValidRegions(legacySavedIds);

    expect(validRegions).toHaveLength(2);
    expect(validRegions[0].fullName).toBe('전남광주통합특별시 광산구');
    expect(validRegions[1].fullName).toBe('전남광주통합특별시 여수시');
  });

  it('관심 지역은 최대 5개까지만 추가되고 6번째는 차단되어야 한다', () => {
    const store = useFavoriteStore.getState();
    store.addFavorite('jeonnam-gwangju-gwangsan');
    store.addFavorite('jeonnam-gwangju-mokpo');
    store.addFavorite('seoul-gangnam');
    store.addFavorite('busan-haeundae');
    store.addFavorite('gyeonggi-suwon');

    expect(useFavoriteStore.getState().favoriteRegionIds).toHaveLength(5);

    // 6번째 추가 시도
    const res = store.addFavorite('daegu-suseong');
    expect(res.success).toBe(false);
    expect(res.reason).toBe('MAX_EXCEEDED');
    expect(useFavoriteStore.getState().favoriteRegionIds).toHaveLength(5);
  });
});
