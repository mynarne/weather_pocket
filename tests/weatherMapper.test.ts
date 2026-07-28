import { describe, it, expect } from 'vitest';
import { getWeatherStatus } from '@/constants/weather';
import { mapCurrentWeather, mapDailyForecast } from '@/lib/mappers/weatherMapper';
import { OpenMeteoCurrentResponse, OpenMeteoForecastResponse } from '@/types/weather';

describe('weatherMapper & getWeatherStatus', () => {
  it('weather_code가 0일 때 맑음과 ☀️ 이모지를 반환해야 한다', () => {
    const status = getWeatherStatus(0);
    expect(status.label).toBe('맑음');
    expect(status.icon).toBe('☀️');
  });

  it('알 수 없는 weather_code(예: 999)일 때 정보 없음과 ❓ 이모지를 반환해야 한다', () => {
    const status = getWeatherStatus(999);
    expect(status.label).toBe('정보 없음');
    expect(status.icon).toBe('❓');
  });

  it('API 현재 날씨 응답이 화면용 CurrentWeather 타입으로 올바르게 변환되어야 한다', () => {
    const mockApiResponse: OpenMeteoCurrentResponse = {
      latitude: 37.5665,
      longitude: 126.978,
      timezone: 'Asia/Seoul',
      current: {
        time: '2026-07-27T18:00',
        interval: 900,
        temperature_2m: 29.4,
        relative_humidity_2m: 68,
        weather_code: 0,
      },
    };

    const mapped = mapCurrentWeather(mockApiResponse);

    expect(mapped.observedAt).toBe('2026-07-27T18:00');
    expect(mapped.temperature).toBe(29.4);
    expect(mapped.humidity).toBe(68);
    expect(mapped.weatherCode).toBe(0);
    expect(mapped.weatherLabel).toBe('맑음');
    expect(mapped.weatherIcon).toBe('☀️');
  });

  it('API 상세 예보 응답이 화면용 DailyForecast[] 배열로 일평균 습도와 함께 올바르게 매핑되어야 한다', () => {
    const mockForecastResponse: OpenMeteoForecastResponse = {
      latitude: 37.5665,
      longitude: 126.978,
      timezone: 'Asia/Seoul',
      current: {
        time: '2026-07-27T18:00',
        interval: 900,
        temperature_2m: 29.4,
        relative_humidity_2m: 68,
        weather_code: 0,
      },
      daily: {
        time: ['2026-07-27', '2026-07-28'],
        temperature_2m_max: [31.0, 30.5],
        temperature_2m_min: [22.0, 21.5],
        weather_code: [0, 3],
      },
      hourly: {
        time: ['2026-07-27T00:00', '2026-07-27T12:00', '2026-07-28T00:00', '2026-07-28T12:00'],
        relative_humidity_2m: [60, 80, 50, 70],
      },
    };

    const mappedList = mapDailyForecast(mockForecastResponse);

    expect(mappedList).toHaveLength(2);
    expect(mappedList[0].date).toBe('2026-07-27');
    expect(mappedList[0].maxTemperature).toBe(31.0);
    expect(mappedList[0].minTemperature).toBe(22.0);
    expect(mappedList[0].weatherLabel).toBe('맑음');
    expect(mappedList[0].averageHumidity).toBe(70);

    expect(mappedList[1].date).toBe('2026-07-28');
    expect(mappedList[1].weatherLabel).toBe('흐림');
    expect(mappedList[1].averageHumidity).toBe(60);
  });
});
