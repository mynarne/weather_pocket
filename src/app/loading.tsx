import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

/**
 * 메인 페이지 서스펜스/로딩 fallback 컴포넌트
 */
export default function Loading() {
  return <LoadingSkeleton type="list" />;
}
