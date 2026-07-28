'use client';

import Link from 'next/link';
import { ErrorMessage } from '@/components/common/ErrorMessage';

interface RegionDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RegionDetailError({ reset }: RegionDetailErrorProps) {
  return (
    <div className="py-12 space-y-6">
      <ErrorMessage
        title="지역 날씨 예보를 불러오지 못했습니다."
        message="네트워크 상태를 확인한 후 다시 시도해주세요."
        onRetry={reset}
      />
      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          홈 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
