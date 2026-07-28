'use client';

interface CitySearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * 정식 지역명, 짧은 지역명, 대표 관측 도시명을 로컬 검색할 수 있는 검색창 컴포넌트
 */
export function CitySearchInput({
  searchQuery,
  onSearchChange,
}: CitySearchInputProps) {
  return (
    <div className="relative my-4 max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="지역명 검색 (예: 서울, 경기, 수원, 제주)..."
        className="w-full px-4 py-2.5 pl-10 pr-9 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        aria-label="지역명 검색"
      />
      <div
        className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm"
        aria-hidden="true"
      >
        🔍
      </div>
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
