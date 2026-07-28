import { City } from '@/types/city';
import {
  CityForecast,
  CityWeather,
  CurrentWeather,
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
} from '@/types/weather';
import { CITIES } from '@/constants/cities';
import { mapCurrentWeather, mapDailyForecast } from '@/lib/mappers/weatherMapper';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const FETCH_TIMEOUT_MS = 10_000; // 10초 타임아웃 설정

/**
 * 단일 도시의 현재 날씨 데이터를 조회합니다.
 * 15분 단위 데이터 재검증과 10초 타임아웃(AbortSignal.timeout)을 적용합니다.
 */
export async function getCurrentWeather(city: City): Promise<CurrentWeather> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', city.latitude.toString());
  url.searchParams.set('longitude', city.longitude.toString());
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
    throw new Error(`${city.name} 현재 날씨를 불러오지 못했습니다.`);
  }

  const data: OpenMeteoCurrentResponse = await response.json();

  if (!data.current) {
    throw new Error(`${city.name} 현재 날씨 데이터가 누락되었습니다.`);
  }

  return mapCurrentWeather(data);
}

/**
 * 17개 지역의 현재 날씨를 조회합니다.
 * 1차로 Open-Meteo 다중 좌표(comma-separated) 단일 요청을 실행하여 1번의 HTTP 통신으로 17개 지역을 페칭하며,
 * 비정상 응답 또는 타임아웃 시 2차로 개별 Promise.allSettled 폴백을 실행하도록 구성되었습니다.
 */
export async function getAllCitiesWeather(): Promise<CityWeather[]> {
  try {
    const latitudes = CITIES.map((c) => c.latitude).join(',');
    const longitudes = CITIES.map((c) => c.longitude).join(',');

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
      const dataList: OpenMeteoCurrentResponse[] = await response.json();

      if (Array.isArray(dataList) && dataList.length === CITIES.length) {
        return CITIES.map((city, index) => {
          const item = dataList[index];
          if (item && item.current) {
            return {
              city,
              current: mapCurrentWeather(item),
              error: false,
            };
          }
          return {
            city,
            current: null,
            error: true,
          };
        });
      }
    }
  } catch {
    // 다중 요청 실패 시 차선책으로 개별 요청 폴백 수행
  }

  // Fallback: 개별 Promise.allSettled
  const results = await Promise.allSettled(
    CITIES.map((city) => getCurrentWeather(city))
  );

  return results.map((result, index) => {
    const city = CITIES[index];
    if (result.status === 'fulfilled') {
      return {
        city,
        current: result.value,
        error: false,
      };
    }
    return {
      city,
      current: null,
      error: true,
    };
  });
}

/**
 * 특정 도시의 상세 예보(현재 날씨 + 7일간 예보 + 시간별 습도)를 조회하여 CityForecast로 반환합니다.
 */
export async function getCityForecast(city: City): Promise<CityForecast> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', city.latitude.toString());
  url.searchParams.set('longitude', city.longitude.toString());
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
    throw new Error(`${city.name}의 날씨 예보를 불러오지 못했습니다.`);
  }

  const data: OpenMeteoForecastResponse = await response.json();

  if (!data.current || !data.daily || !data.hourly) {
    throw new Error(`${city.name} 예보 데이터 응답이 완전하지 않습니다.`);
  }

  const current = mapCurrentWeather(data);
  const daily = mapDailyForecast(data);

  return {
    city,
    current,
    daily,
  };
}
