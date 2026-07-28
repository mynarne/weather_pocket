import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findRegionById } from '@/lib/utils/regionUtils';
import { getRegionForecast } from '@/lib/api/openMeteo';
import { CurrentWeatherSummary } from '@/components/forecast/CurrentWeatherSummary';
import { ForecastList } from '@/components/forecast/ForecastList';

interface RegionDetailPageProps {
  params: Promise<{
    regionId: string;
  }>;
}

/**
 * 특정 시·군·구 지역 상세 날씨 예보 페이지 (Server Component)
 * 선택된 1개 지역의 좌표만 온디맨드로 Open-Meteo API에 요청함.
 * generateStaticParams()를 선언하지 않아 빌드 시점 API 호출이 발생하지 않음.
 */
export default async function RegionDetailPage({ params }: RegionDetailPageProps) {
  const { regionId } = await params;
  const region = findRegionById(regionId);

  if (!region) {
    notFound();
  }

  const forecastData = await getRegionForecast(region);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md py-1 px-2 -ml-2 mb-2"
        >
          ← 홈 화면으로 돌아가기
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
