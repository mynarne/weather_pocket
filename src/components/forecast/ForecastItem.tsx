import { DailyForecast } from '@/types/weather';
import { formatDate } from '@/lib/utils/formatDate';

interface ForecastItemProps {
  forecast: DailyForecast;
}

/**
 * 7일간 예보 목록 중 하루분의 일별 예보 항목을 한 줄로 표시하는 컴포넌트
 */
export function ForecastItem({ forecast }: ForecastItemProps) {
  const { dateLabel, weekdayLabel } = formatDate(forecast.date);

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
      <div className="flex items-center space-x-3 w-32 sm:w-40">
        <span className="text-sm font-bold text-gray-800">{dateLabel}</span>
        <span className="text-xs font-semibold text-gray-400">({weekdayLabel})</span>
      </div>

      <div className="flex items-center space-x-2 w-28 sm:w-36">
        <span className="text-2xl select-none" aria-hidden="true">
          {forecast.weatherIcon}
        </span>
        <span className="text-sm text-gray-600 font-medium truncate">
          {forecast.weatherLabel}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm font-semibold">
        <div className="text-right">
          <span className="text-red-500 font-bold">{forecast.maxTemperature.toFixed(1)}°</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="text-blue-500 font-bold">{forecast.minTemperature.toFixed(1)}°</span>
        </div>

        <div className="text-xs text-gray-400 w-16 text-right font-normal">
          {forecast.averageHumidity !== null ? (
            <span>습도 {forecast.averageHumidity}%</span>
          ) : (
            <span>습도 -</span>
          )}
        </div>
      </div>
    </div>
  );
}
