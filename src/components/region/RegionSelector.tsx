'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROVINCES } from '@/constants/regions';
import { Province, Region } from '@/types/region';

/**
 * 전국 16개 광역자치단체 및 세부 시·군·구 2열 Split 탐색 UI 컴포넌트
 * 
 * - 데스크톱/태블릿: 좌측 260px 세로 목차 목록 | 우측 1fr 시·군·구 Compact Grid
 * - 선택 시 보더/포커스 링 진한 테두리 완전 제거 (포커스 링 0)
 * - 첫 진입 시 '서울특별시' 기본 선택 (API 호출 0회)
 */
export function RegionSelector() {
  // 서울특별시 기본 선택 (API 호출 0회)
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('seoul');

  const selectedProvince: Province =
    PROVINCES.find((p) => p.id === selectedProvinceId) || PROVINCES[0];

  // 전남광주통합특별시 27개 지역 유형별 분류
  const isJeonnamGwangju = selectedProvince.id === 'jeonnam-gwangju';
  const guRegions = isJeonnamGwangju
    ? selectedProvince.regions.filter((r) => r.sigungu.endsWith('구'))
    : [];
  const siRegions = isJeonnamGwangju
    ? selectedProvince.regions.filter((r) => r.sigungu.endsWith('시'))
    : [];
  const gunRegions = isJeonnamGwangju
    ? selectedProvince.regions.filter((r) => r.sigungu.endsWith('군'))
    : [];

  const renderRegionButton = (region: Region) => (
    <Link
      key={region.id}
      href={`/regions/${region.id}`}
      className="p-3 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 border border-slate-200/70 rounded-xl text-center transition-all duration-150 group hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs box-border"
    >
      <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 block truncate">
        {region.displayName}
      </span>
    </Link>
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      {/* 1. 상단 안내 헤더 */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          전국 행정구역 지역 선택
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          시·도를 선택한 뒤, 원하는 시·군·구의 날씨를 확인해 보세요.
        </p>
      </div>

      {/* 2. 반응형 2열 Split 탐색 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 pt-2">
        {/* A. 모바일 전용: 시·도 Native Select / 칩 스크롤 */}
        <div className="block md:hidden space-y-2">
          <label htmlFor="mobile-province-select" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            광역자치단체 선택 (16개)
          </label>
          <select
            id="mobile-province-select"
            value={selectedProvinceId}
            onChange={(e) => setSelectedProvinceId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
          >
            {PROVINCES.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name} ({province.regions.length})
              </option>
            ))}
          </select>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {PROVINCES.map((province) => {
              const isSelected = province.id === selectedProvinceId;
              return (
                <button
                  key={province.id}
                  type="button"
                  onClick={() => setSelectedProvinceId(province.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors box-border ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {province.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* B. 데스크톱/태블릿 전용: 좌측 260px 세로 목차 패널 */}
        <div className="hidden md:block border-r border-gray-100 pr-3.5 space-y-3 box-border">
          <div className="flex items-center justify-between pb-1 px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              광역자치단체
            </h3>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              16개
            </span>
          </div>

          {/* 진한 테두리 라인(focus:ring/border) 완전 제거 */}
          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-2 [scrollbar-gutter:stable] text-sm font-medium">
            {PROVINCES.map((province) => {
              const isSelected = province.id === selectedProvinceId;
              return (
                <button
                  key={province.id}
                  type="button"
                  onClick={() => setSelectedProvinceId(province.id)}
                  aria-pressed={isSelected}
                  className={`w-full px-3.5 py-3 rounded-xl text-left transition-all duration-150 flex items-center justify-between break-keep leading-snug outline-none focus:outline-none focus:ring-0 border-none box-border ${
                    isSelected
                      ? 'bg-blue-50/90 text-blue-600 font-bold'
                      : 'bg-transparent text-gray-600 font-medium hover:bg-gray-50/80 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate pr-1">{province.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                      isSelected
                        ? 'bg-blue-100/80 text-blue-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {province.regions.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* C. 우측 패널: 선택된 광역자치단체의 시·군·구 Compact Grid (1fr) */}
        <div className="space-y-4 box-border">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">{selectedProvince.name}</span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {selectedProvince.regions.length}개 시·군·구
              </span>
            </h3>
          </div>

          {/* 전남광주통합특별시(27개) 자치구(5), 시(5), 군(17) 시각적 그룹화 */}
          {isJeonnamGwangju ? (
            <div className="space-y-5">
              {/* 자치구 5 */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  자치구 ({guRegions.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {guRegions.map(renderRegionButton)}
                </div>
              </div>

              {/* 시 5 */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  시 ({siRegions.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {siRegions.map(renderRegionButton)}
                </div>
              </div>

              {/* 군 17 */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  군 ({gunRegions.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {gunRegions.map(renderRegionButton)}
                </div>
              </div>
            </div>
          ) : (
            /* 일반 시·도의 시·군·구 컴팩트 Grid 버튼 */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {selectedProvince.regions.map(renderRegionButton)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
