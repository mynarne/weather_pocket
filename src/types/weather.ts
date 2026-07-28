import { City } from './city';

/**
 * Open-Meteo API의 현재 날씨 응답 원본 타입
 */
export interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
}

/**
 * Open-Meteo API의 상세 예보 응답 원본 타입
 */
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
  hourly: {
    time: string[];
    relative_humidity_2m: number[];
  };
}

/**
 * 화면용 현재 날씨 타입
 */
export interface CurrentWeather {
  observedAt: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIcon: string;
}

/**
 * 도시 목록 카드용 데이터 타입 (성공/오류 상태 포함)
 */
export interface CityWeather {
  city: City;
  current: CurrentWeather | null;
  error: boolean;
}

/**
 * 화면용 일별 예보 타입
 */
export interface DailyForecast {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIcon: string;
  averageHumidity: number | null;
}

/**
 * 화면용 도시 상세 예보 타입
 */
export interface CityForecast {
  city: City;
  current: CurrentWeather;
  daily: DailyForecast[];
}

/**
 * 날씨 코드 매핑을 위한 정보 타입
 */
export interface WeatherStatus {
  label: string;
  icon: string;
}
