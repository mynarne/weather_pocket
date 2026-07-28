import { describe, it, expect } from 'vitest';
import { findRegionById } from '@/lib/utils/regionUtils';

describe('findRegionById 헬퍼 테스트', () => {
  it('유효한 regionId에 대해 올바른 Region 객체를 반환해야 한다', () => {
    const gangnam = findRegionById('seoul-gangnam');
    expect(gangnam?.fullName).toBe('서울특별시 강남구');

    const suwon = findRegionById('gyeonggi-suwon');
    expect(suwon?.fullName).toBe('경기도 수원시');
  });

  it('유효하지 않은 ID에 대해 undefined를 반환해야 한다', () => {
    const invalid = findRegionById('invalid_id');
    expect(invalid).toBeUndefined();
  });
});
