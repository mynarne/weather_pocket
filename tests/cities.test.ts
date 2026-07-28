import { describe, it, expect } from 'vitest';
import { CITIES, findCityById } from '@/constants/cities';

describe('CITIES 상수 및 헬퍼 검증', () => {
  it('17개 시·도 지역이 정의되어 있어야 하고 ID 중복이 없어야 한다', () => {
    expect(CITIES).toHaveLength(17);
    const ids = CITIES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(17);
  });

  it('모든 지역에 유효한 위도(latitude)와 경도(longitude)가 포함되어 있어야 한다', () => {
    CITIES.forEach((city) => {
      expect(typeof city.latitude).toBe('number');
      expect(typeof city.longitude).toBe('number');
      expect(city.latitude).toBeGreaterThan(30);
      expect(city.latitude).toBeLessThan(40);
      expect(city.longitude).toBeGreaterThan(120);
      expect(city.longitude).toBeLessThan(135);
    });
  });

  it('도 단위(province) 지역에는 representativeCity(대표 관측 도시) 정보가 존재해야 한다', () => {
    const provinces = CITIES.filter((c) => c.category === 'province');
    provinces.forEach((province) => {
      expect(province.representativeCity).toBeDefined();
      expect(typeof province.representativeCity).toBe('string');
      expect(province.representativeCity?.length).toBeGreaterThan(0);
    });
  });

  it('findCityById가 유효한 cityId에 대해 올바른 객체를 반환해야 한다', () => {
    const seoul = findCityById('seoul');
    expect(seoul?.name).toBe('서울특별시');

    const gyeonggi = findCityById('gyeonggi');
    expect(gyeonggi?.representativeCity).toBe('수원');

    const invalid = findCityById('unknown_id');
    expect(invalid).toBeUndefined();
  });
});
