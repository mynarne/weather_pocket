import { describe, it, expect } from 'vitest';
import { ALL_REGIONS, PROVINCES } from '@/constants/regions';

describe('전국 16개 행정구역 및 전남광주통합특별시 정적 데이터 검증', () => {
  it('전국 최상위 광역자치단체 그룹은 정확히 16개여야 한다', () => {
    expect(PROVINCES).toHaveLength(16);
  });

  it('광주광역시와 전라남도 최상위 그룹은 독립적으로 존재하지 않아야 한다', () => {
    const gwangju = PROVINCES.find((p) => p.id === 'gwangju');
    const jeonnam = PROVINCES.find((p) => p.id === 'jeonnam');
    expect(gwangju).toBeUndefined();
    expect(jeonnam).toBeUndefined();
  });

  it('전남광주통합특별시(jeonnam-gwangju) 최상위 그룹이 존재해야 한다', () => {
    const jg = PROVINCES.find((p) => p.id === 'jeonnam-gwangju');
    expect(jg).toBeDefined();
    expect(jg?.name).toBe('전남광주통합특별시');
  });

  it('전남광주통합특별시 산하 시·군·구는 정확히 27개여야 한다', () => {
    const jg = PROVINCES.find((p) => p.id === 'jeonnam-gwangju');
    expect(jg?.regions).toHaveLength(27);
  });

  it('기존 광주 5개 자치구(동/서/남/북/광산)가 전남광주통합특별시 소속이어야 한다', () => {
    const jg = PROVINCES.find((p) => p.id === 'jeonnam-gwangju');
    const gus = ['동구', '서구', '남구', '북구', '광산구'];

    gus.forEach((gu) => {
      const found = jg?.regions.find((r) => r.sigungu === gu);
      expect(found).toBeDefined();
      expect(found?.sido).toBe('전남광주통합특별시');
      expect(found?.fullName).toBe(`전남광주통합특별시 ${gu}`);
    });
  });

  it('기존 전남 22개 시·군(목포시 ~ 신안군)이 전남광주통합특별시 소속이어야 한다', () => {
    const jg = PROVINCES.find((p) => p.id === 'jeonnam-gwangju');
    const sampleSigungus = ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '신안군'];

    sampleSigungus.forEach((sigungu) => {
      const found = jg?.regions.find((r) => r.sigungu === sigungu);
      expect(found).toBeDefined();
      expect(found?.sido).toBe('전남광주통합특별시');
      expect(found?.fullName).toBe(`전남광주통합특별시 ${sigungu}`);
    });
  });

  it('모든 205개 지역 ID가 고유해야 하며 중복 충돌이 없어야 한다', () => {
    const ids = ALL_REGIONS.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ALL_REGIONS.length);
  });
});
