import { describe, it, expect } from 'vitest';
import { filterCities } from '@/lib/utils/filterCities';
import { CityWeather } from '@/types/weather';
import { CITIES } from '@/constants/cities';

describe('filterCities 순수 함수', () => {
  const mockCitiesWeather: CityWeather[] = CITIES.map((city) => ({
    city,
    current: {
      observedAt: '2026-07-27T18:00',
      temperature: 25.0,
      humidity: 60,
      weatherCode: 0,
      weatherLabel: '맑음',
      weatherIcon: '☀️',
    },
    error: false,
  }));

  it('검색어가 없을 때 전체 목록을 반환해야 한다', () => {
    const result = filterCities(mockCitiesWeather, 'all', [], '');
    expect(result).toHaveLength(17);
  });

  it('정식 명칭(예: "서울특별시"), 축약 명칭("서울"), 대표 도시명("수원") 검색이 동작해야 한다', () => {
    const seoulResult = filterCities(mockCitiesWeather, 'all', [], '서울');
    expect(seoulResult.some((c) => c.city.id === 'seoul')).toBe(true);

    const gyeonggiResult = filterCities(mockCitiesWeather, 'all', [], '수원');
    expect(gyeonggiResult.some((c) => c.city.id === 'gyeonggi')).toBe(true);

    const jejuResult = filterCities(mockCitiesWeather, 'all', [], '제주');
    expect(jejuResult.some((c) => c.city.id === 'jeju')).toBe(true);
  });

  it('대소문자 및 양쪽 공백이 자동으로 처리되어야 한다', () => {
    const result = filterCities(mockCitiesWeather, 'all', [], '  서울  ');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].city.id).toBe('seoul');
  });

  it('관심 지역 필터와 검색어가 조합되어 동작해야 한다', () => {
    const validFavoriteIds = ['seoul', 'busan', 'gyeonggi'];
    const favoriteResult = filterCities(
      mockCitiesWeather,
      'favorite',
      validFavoriteIds,
      ''
    );
    expect(favoriteResult).toHaveLength(3);

    const combinedResult = filterCities(
      mockCitiesWeather,
      'favorite',
      validFavoriteIds,
      '수원'
    );
    expect(combinedResult).toHaveLength(1);
    expect(combinedResult[0].city.id).toBe('gyeonggi');
  });

  it('검색 결과가 없는 경우 빈 배열을 반환해야 한다', () => {
    const result = filterCities(mockCitiesWeather, 'all', [], '존재하지않는도시');
    expect(result).toHaveLength(0);
  });
});
