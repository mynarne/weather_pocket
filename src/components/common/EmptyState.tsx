interface EmptyStateProps {
  onResetFilter?: () => void;
}

/**
 * 관심 도시가 등록되어 있지 않을 때 표시하는 빈 상태(Empty State) 컴포넌트
 */
export function EmptyState({ onResetFilter }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm my-6 max-w-md mx-auto">
      <div className="text-4xl mb-3" aria-hidden="true">
        ⭐
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        아직 관심 도시가 없습니다.
      </h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        도시 카드의 별 버튼을 눌러
        <br />
        관심 도시를 추가해보세요.
      </p>
      {onResetFilter && (
        <button
          type="button"
          onClick={onResetFilter}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-600 font-medium text-sm rounded-xl hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          전체 도시 보기
        </button>
      )}
    </div>
  );
}
