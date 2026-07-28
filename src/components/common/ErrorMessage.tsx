interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * 에러 발생 시 공통으로 사용하는 에러 안내 컴포넌트
 */
export function ErrorMessage({
  title = '날씨 정보를 불러오지 못했습니다.',
  message = '잠시 후 다시 시도해주세요.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center my-6 max-w-md mx-auto">
      <div className="text-3xl mb-2" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-1">{title}</h3>
      <p className="text-sm text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-xl hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
