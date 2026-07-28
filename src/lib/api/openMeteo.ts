import { Region } from '@/types/region';
import { City } from '@/types/city';
import {
  CityForecast,
  CityWeather,
  CurrentWeather,
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
} from '@/types/weather';
import { mapCurrentWeather, mapDailyForecast } from '@/lib/mappers/weatherMapper';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const FETCH_TIMEOUT_MS = 10_000;

/**
 * 단일 Region의 현재 날씨 데이터를 조회합니다.
 */
export async function getRegionWeather(region: Region): Promise<CurrentWeather> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', region.latitude.toString());
  url.searchParams.set('longitude', region.longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,weather_code'
  );
  url.searchParams.set('timezone', 'Asia/Seoul');

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 900,
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${region.fullName} 현재 날씨를 불러오지 못했습니다.`);
  }

  const data: OpenMeteoCurrentResponse = await response.json();

  if (!data.current) {
    throw new Error(`${region.fullName} 현재 날씨 데이터가 누락되었습니다.`);
  }

  return mapCurrentWeather(data);
}

/**
 * 관심 지역으로 선택된 Region 배열(최대 5개)의 현재 날씨를 조회합니다.
 * 동일 지역 중복 요청을 제거하고, 1차 다중 좌표 single fetch -> 2차 Promise.allSettled 폴백을 적용합니다.
 */
export async function getFavoriteRegionsWeather(regions: Region[]): Promise<CityWeather[]> {
  if (!regions || regions.length === 0) {
    return [];
  }

  // 중복 ID 제거
  const uniqueRegionsMap = new Map<string, Region>();
  regions.forEach((r) => uniqueRegionsMap.set(r.id, r));
  const uniqueRegions = Array.from(uniqueRegionsMap.values());

  try {
    const latitudes = uniqueRegions.map((r) => r.latitude).join(',');
    const longitudes = uniqueRegions.map((r) => r.longitude).join(',');

    const url = new URL(OPEN_METEO_BASE_URL);
    url.searchParams.set('latitude', latitudes);
    url.searchParams.set('longitude', longitudes);
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,weather_code'
    );
    url.searchParams.set('timezone', 'Asia/Seoul');

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 900,
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.ok) {
      const dataList: OpenMeteoCurrentResponse | OpenMeteoCurrentResponse[] =
        await response.json();

      const items = Array.isArray(dataList) ? dataList : [dataList];

      if (items.length === uniqueRegions.length) {
        return uniqueRegions.map((region, index) => {
          const item = items[index];
          const cityObj: City = {
            id: region.id,
            name: region.fullName,
            shortName: region.displayName,
            latitude: region.latitude,
            longitude: region.longitude,
            category: 'province',
          };

          if (item && item.current) {
            return {
              city: cityObj,
              current: mapCurrentWeather(item),
              error: false,
            };
          }
          return {
            city: cityObj,
            current: null,
            error: true,
          };
        });
      }
    }
  } catch {
    // 1차 다중 페칭 실패 시 폴백 수행
  }

  // Fallback: 개별 Promise.allSettled
  const results = await Promise.allSettled(
    uniqueRegions.map((region) => getRegionWeather(region))
  );

  return results.map((result, index) => {
    const region = uniqueRegions[index];
    const cityObj: City = {
      id: region.id,
      name: region.fullName,
      shortName: region.displayName,
      latitude: region.latitude,
      longitude: region.longitude,
      category: 'province',
    };

    if (result.status === 'fulfilled') {
      return {
        city: cityObj,
        current: result.value,
        error: false,
      };
    }
    return {
      city: cityObj,
      current: null,
      error: true,
    };
  });
}

/**
 * 특정 Region의 상세 예보(현재 날씨 + 7일간 예보 + 시간별 습도)를 조회합니다.
 */
export async function getRegionForecast(region: Region): Promise<CityForecast> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', region.latitude.toString());
  url.searchParams.set('longitude', region.longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,weather_code'
  );
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,weather_code'
  );
  url.searchParams.set('hourly', 'relative_humidity_2m');
  url.searchParams.set('timezone', 'Asia/Seoul');
  url.searchParams.set('forecast_days', '7');

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 900,
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${region.fullName}의 날씨 예보를 불러오지 못했습니다.`);
  }

  const data: OpenMeteoForecastResponse = await response.json();

  if (!data.current || !data.daily || !data.hourly) {
    throw new Error(`${region.fullName} 예보 데이터 응답이 완전하지 않습니다.`);
  }

  const current = mapCurrentWeather(data);
  const daily = mapDailyForecast(data);

  return {
    city: {
      id: region.id,
      name: region.fullName,
      shortName: region.displayName,
      latitude: region.latitude,
      longitude: region.longitude,
      category: 'province',
    },
    current,
    daily,
  };
}
