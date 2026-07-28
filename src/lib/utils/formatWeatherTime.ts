/**
 * ISO 시간 문자열(예: "2026-07-27T18:15")을 받아서
 * 화면 표시용 시간 라벨("18시 기준")로 변환하는 포맷 함수.
 *
 * @param isoString Open-Meteo의 time 문자열
 * @returns 포맷팅된 시각 문자열
 */
export function formatWeatherTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      const timePart = isoString.split('T')[1];
      if (timePart) {
        const hour = timePart.split(':')[0];
        return `${parseInt(hour, 10)}시 기준`;
      }
      return isoString;
    }
    const hours = date.getHours();
    return `${hours}시 기준`;
  } catch {
    return isoString;
  }
}
