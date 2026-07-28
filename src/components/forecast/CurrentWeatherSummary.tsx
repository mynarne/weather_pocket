import { City } from '@/types/city';
import { CurrentWeather } from '@/types/weather';
import { FavoriteButton } from '../city/FavoriteButton';
import { formatWeatherTime } from '@/lib/utils/formatWeatherTime';

interface CurrentWeatherSummaryProps {
  city: City;
  current: CurrentWeather;
}

/**
 * 도시 상세 페이지 상단에 현재 날씨 정보 요약을 표시하는 컴포넌트
 */
export function CurrentWeatherSummary({
  city,
  current,
}: CurrentWeatherSummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            현재 날씨
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {city.name}
          </h1>
        </div>
        <FavoriteButton regionId={city.id} regionName={city.name} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-4">
          <span className="text-5xl sm:text-6xl select-none" aria-hidden="true">
            {current.weatherIcon}
          </span>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              {current.temperature.toFixed(1)}°C
            </div>
            <div className="text-base font-medium text-gray-600 mt-1">
              {current.weatherLabel}
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-8 text-sm text-gray-500 gap-2">
          <div>
            <span className="text-gray-400">습도: </span>
            <span className="font-semibold text-gray-700">{current.humidity}%</span>
          </div>
          <div>
            <span className="text-gray-400">관측: </span>
            <span className="font-semibold text-gray-700">
              {formatWeatherTime(current.observedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
