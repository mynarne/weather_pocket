import { DailyForecast } from '@/types/weather';
import { ForecastItem } from './ForecastItem';

interface ForecastListProps {
  forecasts: DailyForecast[];
}

/**
 * 7일간의 주간 예보 목록을 감싸는 리스트 컴포넌트
 */
export function ForecastList({ forecasts }: ForecastListProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-2 tracking-tight">
        7일간 주간 예보
      </h2>
      <div className="divide-y divide-gray-50">
        {forecasts.map((forecast) => (
          <ForecastItem key={forecast.date} forecast={forecast} />
        ))}
      </div>
    </div>
  );
}
