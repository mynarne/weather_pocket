import { describe, it, expect } from 'vitest';
import { filterValidRegions } from '@/lib/utils/regionUtils';

describe('filterValidRegions 유틸리티 테스트', () => {
  it('유효한 지역 ID만 정확히 추출하고 중복을 제거해야 한다', () => {
    const input = ['seoul-gangnam', 'seoul-gangnam', 'busan-haeundae', 'unknown-id'];
    const result = filterValidRegions(input);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('seoul-gangnam');
    expect(result[1].id).toBe('busan-haeundae');
  });

  it('빈 배열 입력 시 빈 배열을 반환해야 한다', () => {
    expect(filterValidRegions([])).toEqual([]);
  });
});
