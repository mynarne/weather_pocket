'use client';

import Link from 'next/link';
import { ErrorMessage } from '@/components/common/ErrorMessage';

interface CityDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 도시 상세 페이지 전용 에러 바운더리 컴포넌트
 */
export default function CityDetailError({ reset }: CityDetailErrorProps) {
  return (
    <div className="py-12 space-y-6">
      <ErrorMessage
        title="날씨 예보를 불러오지 못했습니다."
        message="네트워크 상태를 확인한 후 다시 시도해주세요."
        onRetry={reset}
      />
      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          도시 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
