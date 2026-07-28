'use client';

import { useState } from 'react';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface FavoriteButtonProps {
  regionId: string;
  regionName: string;
}

/**
 * 지역 상세 페이지 및 홈 화면 관심 지역 카드에서 사용하는 즐겨찾기(별) 버튼
 * - 최대 5개 제한 정책 적용 및 초과 시 안내 메시지 팝업 처리
 */
export function FavoriteButton({ regionId, regionName }: FavoriteButtonProps) {
  const isMounted = useIsMounted();
  const favoriteRegionIds = useFavoriteStore((state) => state.favoriteRegionIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isFav = isMounted ? favoriteRegionIds.includes(regionId) : false;
  const label = isFav
    ? `${regionName} 관심 지역 해제`
    : `${regionName} 관심 지역 추가`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const res = toggleFavorite(regionId);
    if (!res.success && res.action === 'MAX_EXCEEDED') {
      setToastMessage('관심 지역은 최대 5개까지 등록할 수 있습니다.\n기존 지역을 삭제한 뒤 다시 추가해 주세요.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="relative inline-block">
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

      {toastMessage && (
        <div className="absolute right-0 top-12 z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl leading-relaxed animate-fade-in border border-gray-700">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
