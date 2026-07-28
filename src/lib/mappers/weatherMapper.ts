import {
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
  CurrentWeather,
  DailyForecast,
} from '@/types/weather';
import { getWeatherStatus } from '@/constants/weather';
import { calculateDailyHumidity } from '@/lib/utils/calculateDailyHumidity';

/**
 * Open-Meteo current API 응답 객체를 화면 전용 CurrentWeather 도메인 타입으로 매핑
 *
 * @param response OpenMeteoCurrentResponse 원본 응답
 * @returns CurrentWeather 화면용 타입
 */
export function mapCurrentWeather(response: OpenMeteoCurrentResponse): CurrentWeather {
  const weatherStatus = getWeatherStatus(response.current.weather_code);

  return {
    observedAt: response.current.time,
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    weatherCode: response.current.weather_code,
    weatherLabel: weatherStatus.label,
    weatherIcon: weatherStatus.icon,
  };
}

/**
 * Open-Meteo forecast API 응답 객체를 화면 전용 DailyForecast[] 타입 목록으로 매핑
 * hourly 상대습도 데이터를 날짜별로 그룹화하여 일평균 습도를 계산한 뒤 결합함.
 *
 * @param response OpenMeteoForecastResponse 원본 응답
 * @returns DailyForecast[] 일별 예보 목록
 */
export function mapDailyForecast(response: OpenMeteoForecastResponse): DailyForecast[] {
  const { daily, hourly } = response;
  const dailyHumidityMap = calculateDailyHumidity(hourly.time, hourly.relative_humidity_2m);

  const forecastList: DailyForecast[] = [];
  const totalDays = daily.time.length;

  for (let i = 0; i < totalDays; i++) {
    const dateStr = daily.time[i];
    const weatherStatus = getWeatherStatus(daily.weather_code[i]);
    const avgHumidity = dailyHumidityMap[dateStr] ?? null;

    forecastList.push({
      date: dateStr,
      maxTemperature: daily.temperature_2m_max[i],
      minTemperature: daily.temperature_2m_min[i],
      weatherCode: daily.weather_code[i],
      weatherLabel: weatherStatus.label,
      weatherIcon: weatherStatus.icon,
      averageHumidity: avgHumidity,
    });
  }

  return forecastList;
}
