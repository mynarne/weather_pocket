'use client';

import { useState } from 'react';
import { CityWeather } from '@/types/weather';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { CityCard } from './CityCard';
import { CityListFilter } from './CityListFilter';
import { CitySearchInput } from './CitySearchInput';
import { EmptyState } from '../common/EmptyState';

interface CityListProps {
  citiesWeather: CityWeather[];
}

/**
 * 관심 지역 및 날씨 카드 목록 렌더링 컴포넌트
 */
export function CityList({ citiesWeather }: CityListProps) {
  const [filter, setFilter] = useState<'all' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isMounted = useIsMounted();

  const favoriteRegionIds = useFavoriteStore((state) => state.favoriteRegionIds);

  const validFavoriteIds = isMounted
    ? favoriteRegionIds.filter((favId) =>
        citiesWeather.some((item) => item.city.id === favId)
      )
    : [];

  const filteredCitiesWeather = citiesWeather.filter((item) => {
    if (filter === 'favorite' && !validFavoriteIds.includes(item.city.id)) {
      return false;
    }
    if (searchQuery.trim()) {
      return item.city.name.includes(searchQuery.trim());
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 my-4">
        <CityListFilter
          filter={filter}
          onFilterChange={setFilter}
          totalCount={citiesWeather.length}
          favoriteCount={validFavoriteIds.length}
        />
        <CitySearchInput
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {filter === 'favorite' && validFavoriteIds.length === 0 ? (
        <EmptyState onResetFilter={() => setFilter('all')} />
      ) : filteredCitiesWeather.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm my-6 max-w-md mx-auto">
          <div className="text-4xl mb-3" aria-hidden="true">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            검색 결과가 없습니다.
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            &apos;{searchQuery}&apos; 에 해당하는 지역을 찾을 수 없습니다.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 font-medium text-sm rounded-xl hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            검색어 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCitiesWeather.map((cityWeather) => (
            <CityCard key={cityWeather.city.id} cityWeather={cityWeather} />
          ))}
        </div>
      )}
    </div>
  );
}
