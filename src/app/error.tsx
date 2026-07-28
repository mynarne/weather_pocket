'use client';

import { ErrorMessage } from '@/components/common/ErrorMessage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 루트 에러 바운더리 컴포넌트
 */
export default function Error({ reset }: ErrorProps) {
  return (
    <div className="py-12">
      <ErrorMessage
        title="날씨 정보를 불러오지 못했습니다."
        message="잠시 후 다시 시도해주세요."
        onRetry={reset}
      />
    </div>
  );
}
