import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FavoriteState {
  favoriteCityIds: string[];
  toggleFavorite: (cityId: string) => void;
  isFavorite: (cityId: string) => boolean;
}

/**
 * 관심 도시 ID 저장 및 조회를 담당하는 Zustand 클라이언트 스토어.
 * Zustand persist 미들웨어를 사용하여 localStorage ('weather-pocket-favorites' 키)에 영속화함.
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteCityIds: [],
      toggleFavorite: (cityId: string) => {
        const { favoriteCityIds } = get();
        if (favoriteCityIds.includes(cityId)) {
          set({
            favoriteCityIds: favoriteCityIds.filter((id) => id !== cityId),
          });
        } else {
          set({
            favoriteCityIds: [...favoriteCityIds, cityId],
          });
        }
      },
      isFavorite: (cityId: string) => {
        return get().favoriteCityIds.includes(cityId);
      },
    }),
    {
      name: 'weather-pocket-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
