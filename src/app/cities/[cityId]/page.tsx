import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findCityById } from '@/constants/cities';
import { getCityForecast } from '@/lib/api/openMeteo';
import { CurrentWeatherSummary } from '@/components/forecast/CurrentWeatherSummary';
import { ForecastList } from '@/components/forecast/ForecastList';

interface CityDetailPageProps {
  params: Promise<{
    cityId: string;
  }>;
}

/**
 * 도시 상세 날씨 예보 페이지 (Server Component)
 * 날씨 데이터의 실시간성과 빌드 타임 외부 API 의존성 해소를 위해
 * 빌드 시점 사전 렌더링(generateStaticParams) 대신 사용자 요청 시 15분 재검증 온디맨드 렌더링을 적용함.
 */
export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const { cityId } = await params;
  const city = findCityById(cityId);

  if (!city) {
    notFound();
  }

  const forecastData = await getCityForecast(city);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md py-1 px-2 -ml-2 mb-2"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <CurrentWeatherSummary
        city={forecastData.city}
        current={forecastData.current}
      />
      <ForecastList forecasts={forecastData.daily} />
    </div>
  );
}
