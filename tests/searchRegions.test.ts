import { describe, it, expect } from 'vitest';
import { searchRegions } from '@/lib/utils/regionUtils';

describe('searchRegions 지역 검색 및 alias 지원 테스트', () => {
  it('"광산구" 검색 시 전남광주통합특별시 광산구가 반환되어야 한다', () => {
    const results = searchRegions('광산구');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullName).toBe('전남광주통합특별시 광산구');
  });

  it('"목포" 검색 시 전남광주통합특별시 목포시가 반환되어야 한다', () => {
    const results = searchRegions('목포');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullName).toBe('전남광주통합특별시 목포시');
  });

  it('과거 검색어 alias "광주 광산구" 검색 시 공식 통합명 "전남광주통합특별시 광산구"가 반환되어야 한다', () => {
    const results = searchRegions('광주 광산구');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.fullName === '전남광주통합특별시 광산구')).toBe(true);
  });

  it('과거 검색어 alias "전남 목포" 검색 시 공식 통합명 "전남광주통합특별시 목포시"가 반환되어야 한다', () => {
    const results = searchRegions('전남 목포');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.fullName === '전남광주통합특별시 목포시')).toBe(true);
  });

  it('검색 결과에 과거 명칭 "광주광역시"나 "전라남도"가 포함되어선 안 된다', () => {
    const results = searchRegions('광산구');
    results.forEach((r) => {
      expect(r.sido).not.toBe('광주광역시');
      expect(r.sido).not.toBe('전라남도');
      expect(r.sido).toBe('전남광주통합특별시');
    });
  });
});
