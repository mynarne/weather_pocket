import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

/**
 * 도시 상세 페이지 서스펜스/로딩 fallback 컴포넌트
 */
export default function CityDetailLoading() {
  return <LoadingSkeleton type="detail" />;
}
