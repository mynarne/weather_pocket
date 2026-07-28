import { RegionSelector } from '@/components/region/RegionSelector';
import { FavoriteRegionsSection } from '@/components/region/FavoriteRegionsSection';

/**
 * 메인 홈 페이지 (Server Component)
 * - 2026년 7월 전남광주통합특별시 출범 완벽 반영
 * - 메인 진입 시 전국 전체 행정구역에 대한 API 조회를 수행하지 않음 (API 0회)
 * - 관심 지역에 등록된 지역(최대 5개)만 온디맨드로 조회함
 */
export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Weather Pocket
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1.5 leading-relaxed">
          전국 16개 광역자치단체 및 205개 시·군·구 행정구역 날씨를 확인하고 관심 지역으로 등록해 보세요.
        </p>
      </div>

      {/* 1. 관심 지역 날씨 섹션 (최대 5개만 온디맨드 조회) */}
      <FavoriteRegionsSection />

      {/* 2. 전국 16개 시·도 및 시·군·구 행정구역 탐색 UI (API 0회) */}
      <RegionSelector />
    </div>
  );
}
