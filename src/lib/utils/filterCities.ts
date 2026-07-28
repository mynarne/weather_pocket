import { CityWeather } from '@/types/weather';

/**
 * 도시 목록을 관심 필터 상태 및 검색어(정식명, 축약명, 대표도시명)와 대소문자 구분 없이 조합하여 필터링하는 순수 함수
 *
 * @param citiesWeather 전체 도시 날씨 목록
 * @param filter 'all' | 'favorite' 선택 필터
 * @param validFavoriteIds 마운트된 유효 관심 도시 ID 목록
 * @param searchQuery 입력 검색어
 * @returns 필터링된 CityWeather[] 목록
 */
export function filterCities(
  citiesWeather: CityWeather[],
  filter: 'all' | 'favorite',
  validFavoriteIds: string[],
  searchQuery: string
): CityWeather[] {
  const trimmedQuery = searchQuery.trim().toLowerCase();

  return citiesWeather.filter((item) => {
    const { city } = item;

    // 1. 관심 지역 필터 적용
    if (filter === 'favorite' && !validFavoriteIds.includes(city.id)) {
      return false;
    }

    // 2. 검색어 필터 적용 (정식 명칭, 축약 명칭, 대표 관측 도시명 비교)
    if (trimmedQuery) {
      const matchName = city.name.toLowerCase().includes(trimmedQuery);
      const matchShort = city.shortName.toLowerCase().includes(trimmedQuery);
      const matchRep = city.representativeCity
        ? city.representativeCity.toLowerCase().includes(trimmedQuery)
        : false;

      return matchName || matchShort || matchRep;
    }

    return true;
  });
}
