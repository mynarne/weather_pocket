'use client';

import { useState, useEffect } from 'react';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { filterValidRegions } from '@/lib/utils/regionUtils';
import { getFavoriteRegionsWeather } from '@/lib/api/openMeteo';
import { CityWeather } from '@/types/weather';
import { CityCard } from '../city/CityCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * 관심 지역 전용 날씨 카드 리스트 섹션
 * - 저장된 관심 지역(최대 5개)만 온디맨드로 날씨 API를 호출함
 * - 관심 지역 0개 시 직관적인 안내 Empty State 출력
 */
export function FavoriteRegionsSection() {
  const isMounted = useIsMounted();
  const favoriteRegionIds = useFavoriteStore((state) => state.favoriteRegionIds);

  const [weatherList, setWeatherList] = useState<CityWeather[]>([]);
  const [fetchingKey, setFetchingKey] = useState<string>('');

  const validRegions = isMounted ? filterValidRegions(favoriteRegionIds) : [];
  const regionKey = validRegions.map((r) => r.id).join(',');

  useEffect(() => {
    if (!isMounted || !regionKey) {
      return;
    }

    let isCancelled = false;

    Promise.resolve().then(() => {
      if (!isCancelled) {
        setFetchingKey(regionKey);
      }
    });

    getFavoriteRegionsWeather(validRegions)
      .then((data) => {
        if (!isCancelled) {
          setWeatherList(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setWeatherList([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setFetchingKey('');
        }
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, regionKey]);

  if (!isMounted) {
    return <LoadingSkeleton type="list" />;
  }

  const isLoading = fetchingKey === regionKey && weatherList.length === 0;
  const effectiveWeatherList = validRegions.length === 0 ? [] : weatherList;

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          관심 지역 날씨 ({validRegions.length}/5)
        </h2>
      </div>

      {validRegions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3" aria-hidden="true">
            ⭐
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            아직 등록된 관심 지역이 없습니다.
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            아래에서 전국 행정구역을 선택하여 날씨를 확인하고
            <br />
            관심 지역(최대 5개)으로 등록해 보세요.
          </p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton type="list" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {effectiveWeatherList.map((item) => (
            <CityCard key={item.city.id} cityWeather={item} />
          ))}
        </div>
      )}
    </div>
  );
}
