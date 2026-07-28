import Link from 'next/link';
import { CityWeather } from '@/types/weather';
import { formatWeatherTime } from '@/lib/utils/formatWeatherTime';
import { FavoriteButton } from './FavoriteButton';

interface CityCardProps {
  cityWeather: CityWeather;
}

/**
 * 개별 지역의 날씨 정보를 표시하는 카드 컴포넌트
 * 도 단위 지역인 경우 대표 관측 도시 기준 라벨(예: "수원 기준")을 함께 표시함.
 */
export function CityCard({ cityWeather }: CityCardProps) {
  const { city, current, error } = cityWeather;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full min-h-[240px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {city.name}
          </h2>
          {city.representativeCity && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              {city.representativeCity} 기준
            </span>
          )}
        </div>
        <FavoriteButton cityId={city.id} cityName={city.name} />
      </div>

      {error || !current ? (
        <div className="my-auto py-4 text-center bg-gray-50 rounded-xl px-4 border border-gray-100">
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            날씨 정보를 불러오지 못했습니다.
            <br />
            잠시 후 다시 확인해주세요.
          </p>
        </div>
      ) : (
        <div className="my-2">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl select-none" aria-hidden="true">
              {current.weatherIcon}
            </span>
            <div>
              <span className="text-sm font-medium text-gray-600 block">
                {current.weatherLabel}
              </span>
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {current.temperature.toFixed(1)}°C
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 space-x-3 mt-3 pt-3 border-t border-gray-50">
            <span>습도 {current.humidity}%</span>
            <span>•</span>
            <span>{formatWeatherTime(current.observedAt)}</span>
          </div>
        </div>
      )}

      <div className="pt-3 mt-1 flex justify-end">
        <Link
          href={`/cities/${city.id}`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md py-1 px-2 -mr-2"
        >
          주간 예보 보기 →
        </Link>
      </div>
    </div>
  );
}
