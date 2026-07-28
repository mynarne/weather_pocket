import { getAllCitiesWeather } from '@/lib/api/openMeteo';
import { CityList } from '@/components/city/CityList';

/**
 * 메인 도시 목록 페이지 (Server Component)
 * 단 1번의 다중 좌표 페칭으로 전국 17개 시·도 데이터를 효율적으로 받아옴.
 */
export default async function HomePage() {
  const citiesWeather = await getAllCitiesWeather();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Weather Pocket
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          전국 17개 시·도의 대표 지역 날씨를 확인하고 관심 지역을 저장할 수 있습니다.
        </p>
      </div>

      <CityList citiesWeather={citiesWeather} />
    </div>
  );
}
