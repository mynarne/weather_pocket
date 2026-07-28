import { redirect, notFound } from 'next/navigation';

const OLD_CITY_MAPPING: Record<string, string> = {
  seoul: 'seoul-junggu',
  busan: 'busan-haeundae',
  daegu: 'daegu-suseong',
  incheon: 'incheon-yeonsu',
  cheongju: 'chungbuk-cheongju',
};

interface OldCityPageProps {
  params: Promise<{
    cityId: string;
  }>;
}

export default async function OldCityRedirectPage({ params }: OldCityPageProps) {
  const { cityId } = await params;
  const mappedRegionId = OLD_CITY_MAPPING[cityId];

  if (mappedRegionId) {
    redirect(`/regions/${mappedRegionId}`);
  }

  notFound();
}
