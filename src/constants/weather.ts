import { WeatherStatus } from '@/types/weather';

/**
 * Open-Meteo weather_code 번호에 따른 날씨 한글 라벨 및 이모지 매핑
 */
export const WEATHER_STATUS: Record<number, WeatherStatus> = {
  0: { label: '맑음', icon: '☀️' },
  1: { label: '대체로 맑음', icon: '🌤️' },
  2: { label: '구름 조금', icon: '⛅' },
  3: { label: '흐림', icon: '☁️' },
  45: { label: '안개', icon: '🌫️' },
  48: { label: '짙은 안개', icon: '🌫️' },
  51: { label: '약한 이슬비', icon: '🌦️' },
  53: { label: '이슬비', icon: '🌦️' },
  55: { label: '강한 이슬비', icon: '🌧️' },
  61: { label: '약한 비', icon: '🌧️' },
  63: { label: '비', icon: '🌧️' },
  65: { label: '강한 비', icon: '⛈️' },
  71: { label: '약한 눈', icon: '🌨️' },
  73: { label: '눈', icon: '🌨️' },
  75: { label: '강한 눈', icon: '❄️' },
  80: { label: '소나기', icon: '🌦️' },
  81: { label: '소나기', icon: '🌧️' },
  82: { label: '강한 소나기', icon: '⛈️' },
  95: { label: '천둥번개', icon: '⛈️' },
  96: { label: '우박 동반 뇌우', icon: '⛈️' },
};

/**
 * 정의되지 않은 weather_code일 경우 반환할 폴백(fallback) 날씨 정보
 */
export const UNKNOWN_WEATHER: WeatherStatus = {
  label: '정보 없음',
  icon: '❓',
};

/**
 * weather_code를 전달받아 WeatherStatus 정보(label, icon)를 반환하는 함수
 */
export function getWeatherStatus(code: number): WeatherStatus {
  return WEATHER_STATUS[code] ?? UNKNOWN_WEATHER;
}
