'use client';

interface CityListFilterProps {
  filter: 'all' | 'favorite';
  onFilterChange: (filter: 'all' | 'favorite') => void;
  totalCount: number;
  favoriteCount: number;
}

/**
 * 전체 도시 / 관심 도시 필터를 선택할 수 있는 탭 스위치 컴포넌트
 */
export function CityListFilter({
  filter,
  onFilterChange,
  totalCount,
  favoriteCount,
}: CityListFilterProps) {
  return (
    <div className="flex items-center space-x-2 my-6">
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        aria-pressed={filter === 'all'}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          filter === 'all'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        전체 도시 {totalCount}
      </button>

      <button
        type="button"
        onClick={() => onFilterChange('favorite')}
        aria-pressed={filter === 'favorite'}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          filter === 'favorite'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        관심 도시 {favoriteCount}
      </button>
    </div>
  );
}
