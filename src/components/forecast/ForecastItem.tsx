import { DailyForecast } from '@/types/weather';
import { formatDate } from '@/lib/utils/formatDate';

interface ForecastItemProps {
  forecast: DailyForecast;
}

/**
 * 7일간 예보 목록 중 하루분의 일별 예보 항목을 한 줄로 표시하는 컴포넌트
 * 모바일 화면에서도 날짜(예: "8월 3일")가 2줄로 줄바꿈되지 않도록 whitespace-nowrap 보장
 */
export function ForecastItem({ forecast }: ForecastItemProps) {
  const { dateLabel, weekdayLabel } = formatDate(forecast.date);

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 gap-2 sm:gap-4">
      {/* 1. 날짜 영역 (whitespace-nowrap 적용으로 모바일 2줄 쪼개짐 완벽 방지) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap flex-shrink-0 min-w-[84px] sm:min-w-[120px]">
        <span className="text-xs sm:text-sm font-bold text-gray-800 whitespace-nowrap">
          {dateLabel}
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">
          ({weekdayLabel})
        </span>
      </div>

      {/* 2. 날씨 상태 아이콘 & 텍스트 */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
        <span className="text-xl sm:text-2xl select-none flex-shrink-0" aria-hidden="true">
          {forecast.weatherIcon}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 font-medium truncate">
          {forecast.weatherLabel}
        </span>
      </div>

      {/* 3. 기온 (최고/최저) 및 습도 */}
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-semibold flex-shrink-0">
        <div className="text-right whitespace-nowrap">
          <span className="text-red-500 font-bold">{forecast.maxTemperature.toFixed(1)}°</span>
          <span className="text-gray-300 mx-0.5 sm:mx-1">/</span>
          <span className="text-blue-500 font-bold">{forecast.minTemperature.toFixed(1)}°</span>
        </div>

        <div className="text-[11px] sm:text-xs text-gray-400 text-right font-normal whitespace-nowrap hidden min-[380px]:block">
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
