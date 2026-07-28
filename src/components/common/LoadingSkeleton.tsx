interface LoadingSkeletonProps {
  type?: 'list' | 'detail';
}

/**
 * 로딩 상태일 때 실제 레이아웃 형태를 유지하며 표시하는 스켈레톤 컴포넌트
 */
export function LoadingSkeleton({ type = 'list' }: LoadingSkeletonProps) {
  if (type === 'detail') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-12 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
          <div className="h-6 w-28 bg-gray-200 rounded mb-4"></div>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between h-56"
        >
          <div className="flex justify-between items-start">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3 my-2">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
