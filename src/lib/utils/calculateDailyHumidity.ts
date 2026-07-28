/**
 * hourly.time과 hourly.relative_humidity_2m 배열을 입력받아
 * 날짜별(YYYY-MM-DD) 일평균 습도를 계산하여 반올림한 객체로 반환하는 순수 함수.
 *
 * @param times ISO 형태의 시간 문자열 배열 (예: "2026-07-27T00:00")
 * @param humidities 시간대별 상대습도 숫자 배열
 * @returns 날짜를 키로 하고 평균 습도를 값으로 하는 객체 (예: { "2026-07-27": 71 })
 */
export function calculateDailyHumidity(
  times: string[],
  humidities: number[]
): Record<string, number> {
  if (!times || !humidities || times.length === 0 || humidities.length === 0) {
    return {};
  }

  const grouped: Record<string, number[]> = {};
  const minLength = Math.min(times.length, humidities.length);

  for (let i = 0; i < minLength; i++) {
    const timeStr = times[i];
    const humidityVal = humidities[i];

    // 타입 유효성 검사: 문자열이 아니거나 숫자가 아니면 제외
    if (typeof timeStr !== 'string' || typeof humidityVal !== 'number' || isNaN(humidityVal)) {
      continue;
    }

    // 날짜 부분 추출 (YYYY-MM-DD)
    const dateKey = timeStr.slice(0, 10);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(humidityVal);
  }

  const result: Record<string, number> = {};
  for (const dateKey of Object.keys(grouped)) {
    const values = grouped[dateKey];
    if (values.length > 0) {
      const sum = values.reduce((acc, curr) => acc + curr, 0);
      result[dateKey] = Math.round(sum / values.length);
    }
  }

  return result;
}
