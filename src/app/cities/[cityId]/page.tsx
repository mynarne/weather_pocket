import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, findCityById } from '@/constants/cities';
import { getCityForecast } from '@/lib/api/openMeteo';
import { CurrentWeatherSummary } from '@/components/forecast/CurrentWeatherSummary';
import { ForecastList } from '@/components/forecast/ForecastList';

interface CityDetailPageProps {
  params: Promise<{
    cityId: string;
  }>;
}

/**
 * 17개 정적 도시 ID 목록에 대해 정적 파라미터를 생성함
 */
export async function generateStaticParams() {
  return CITIES.map((city) => ({
    cityId: city.id,
  }));
}

/**
 * 도시 상세 날씨 예보 페이지 (Server Component)
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
