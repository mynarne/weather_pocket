'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchRegions } from '@/lib/utils/regionUtils';
import { Region } from '@/types/region';

/**
 * 전국 시·군·구 실시간 정적 지역 검색 컴포넌트
 * - 검색 과정에서 외부 API를 전혀 호출하지 않음 (API 0회)
 * - 과거 명칭("광주 광산구", "전남 목포") 검색 시 공식 통합명("전남광주통합특별시 광산구/목포시")으로 표시
 */
export function RegionSearchInput() {
  const [query, setQuery] = useState('');

  const searchResults: Region[] = searchRegions(query);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="시·도 또는 시·군·구 검색 (예: 수원, 광산구, 목포)..."
          className="w-full px-4 py-2.5 pl-10 pr-9 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-none transition-all"
          aria-label="시·도 또는 시·군·구 검색"
        />
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm"
          aria-hidden="true"
        >
          🔍
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 드로어 */}
      {query.trim() && (
        <div className="absolute top-12 left-0 right-0 z-40 bg-white rounded-xl border border-gray-200 shadow-xl max-h-80 overflow-y-auto divide-y divide-gray-50">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              &apos;{query}&apos; 에 해당하는 지역을 찾을 수 없습니다.
            </div>
          ) : (
            searchResults.map((region) => (
              <Link
                key={region.id}
                href={`/regions/${region.id}`}
                onClick={() => setQuery('')}
                className="flex items-center justify-between p-3 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    {region.sido}
                  </span>
                  <span className="text-sm font-bold text-gray-800 truncate">
                    {region.sigungu}
                  </span>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2">
                  이동 →
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
