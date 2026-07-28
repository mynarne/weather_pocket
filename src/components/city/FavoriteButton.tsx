'use client';

import { useFavoriteStore } from '@/stores/favoriteStore';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface FavoriteButtonProps {
  cityId: string;
  cityName: string;
}

/**
 * 도시 카드 및 상세 페이지에서 사용하는 관심 도시(즐겨찾기) 토글 버튼 컴포넌트
 * Client Component로서 Zustand store의 영속화된 favoriteCityIds 상태와 동기화됨.
 * 카드 전체 링크 클릭과 이벤트가 겹치지 않도록 e.stopPropagation() 처리 적용.
 */
export function FavoriteButton({ cityId, cityName }: FavoriteButtonProps) {
  const isMounted = useIsMounted();
  const favoriteCityIds = useFavoriteStore((state) => state.favoriteCityIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const isFav = isMounted ? favoriteCityIds.includes(cityId) : false;
  const label = isFav
    ? `${cityName} 관심 도시 해제`
    : `${cityName} 관심 도시 추가`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(cityId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
        isFav
          ? 'text-amber-400 hover:text-amber-500 bg-amber-50'
          : 'text-gray-300 hover:text-amber-400 hover:bg-gray-50'
      }`}
    >
      <span className="text-xl leading-none block select-none" aria-hidden="true">
        {isFav ? '★' : '☆'}
      </span>
    </button>
  );
}
