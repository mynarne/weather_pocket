import { describe, it, expect } from 'vitest';
import { calculateDailyHumidity } from '@/lib/utils/calculateDailyHumidity';

describe('calculateDailyHumidity', () => {
  it('같은 날짜의 습도 평균을 올바르게 계산하고 반올림해야 한다', () => {
    const times = [
      '2026-07-27T00:00',
      '2026-07-27T01:00',
      '2026-07-27T02:00',
    ];
    const humidities = [70, 72, 74];

    const result = calculateDailyHumidity(times, humidities);
    expect(result['2026-07-27']).toBe(72);
  });

  it('여러 날짜가 포함되어 있을 때 날짜별로 각각 분리하여 평균을 구해야 한다', () => {
    const times = [
      '2026-07-27T00:00',
      '2026-07-27T12:00',
      '2026-07-28T00:00',
      '2026-07-28T12:00',
    ];
    const humidities = [60, 80, 50, 90];

    const result = calculateDailyHumidity(times, humidities);
    expect(result['2026-07-27']).toBe(70);
    expect(result['2026-07-28']).toBe(70);
  });

  it('빈 배열이나 유효하지 않은 입력이 오면 빈 객체를 반환해야 한다', () => {
    expect(calculateDailyHumidity([], [])).toEqual({});
    expect(calculateDailyHumidity(['2026-07-27T00:00'], [])).toEqual({});
  });

  it('배열 길이가 다르거나 NaN 등 비정상 값이 포함된 경우 안전하게 처리해야 한다', () => {
    const times = ['2026-07-27T00:00', '2026-07-27T01:00', '2026-07-27T02:00'];
    const humidities = [70, NaN, 80];

    const result = calculateDailyHumidity(times, humidities);
    // NaN 제외 후 70, 80 평균인 75가 나오는지 검증
    expect(result['2026-07-27']).toBe(75);
  });
});
