import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { migrateRegionId } from '@/lib/utils/regionUtils';

export const MAX_FAVORITE_REGIONS = 5;

export interface FavoriteRegionState {
  favoriteRegionIds: string[];
  addFavorite: (regionId: string) => { success: boolean; reason?: 'MAX_EXCEEDED' | 'ALREADY_EXISTS' };
  removeFavorite: (regionId: string) => void;
  toggleFavorite: (regionId: string) => { success: boolean; action: 'ADDED' | 'REMOVED' | 'MAX_EXCEEDED' };
  isFavorite: (regionId: string) => boolean;
}

/**
 * 관심 지역 ID 전역 상태 관리 및 영속화 스토어
 * - 2026년 7월 전남광주통합특별시 출범에 따른 구형 ID 자동 마이그레이션 지원
 * - 최대 5개 등록 제한
 * - 중복 등록 방지
 * - localStorage 영속화 ('weather-pocket-favorite-regions')
 */
export const useFavoriteStore = create<FavoriteRegionState>()(
  persist(
    (set, get) => ({
      favoriteRegionIds: [],

      addFavorite: (rawRegionId: string) => {
        const regionId = migrateRegionId(rawRegionId);
        const { favoriteRegionIds } = get();

        // 현재 저장된 목록도 마이그레이션 적용
        const migratedList = Array.from(new Set(favoriteRegionIds.map(migrateRegionId)));

        if (migratedList.includes(regionId)) {
          return { success: false, reason: 'ALREADY_EXISTS' };
        }

        if (migratedList.length >= MAX_FAVORITE_REGIONS) {
          return { success: false, reason: 'MAX_EXCEEDED' };
        }

        set({
          favoriteRegionIds: [...migratedList, regionId],
        });
        return { success: true };
      },

      removeFavorite: (rawRegionId: string) => {
        const regionId = migrateRegionId(rawRegionId);
        const { favoriteRegionIds } = get();
        const migratedList = favoriteRegionIds.map(migrateRegionId);

        set({
          favoriteRegionIds: migratedList.filter((id) => id !== regionId),
        });
      },

      toggleFavorite: (rawRegionId: string) => {
        const regionId = migrateRegionId(rawRegionId);
        const { favoriteRegionIds, removeFavorite, addFavorite } = get();
        const migratedList = favoriteRegionIds.map(migrateRegionId);

        if (migratedList.includes(regionId)) {
          removeFavorite(regionId);
          return { success: true, action: 'REMOVED' };
        } else {
          const res = addFavorite(regionId);
          if (res.success) {
            return { success: true, action: 'ADDED' };
          }
          return { success: false, action: 'MAX_EXCEEDED' };
        }
      },

      isFavorite: (rawRegionId: string) => {
        const regionId = migrateRegionId(rawRegionId);
        const migratedList = get().favoriteRegionIds.map(migrateRegionId);
        return migratedList.includes(regionId);
      },
    }),
    {
      name: 'weather-pocket-favorite-regions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
