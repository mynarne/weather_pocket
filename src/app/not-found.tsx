import Link from 'next/link';

/**
 * 루트 404 Not Found 컴포넌트
 */
export default function NotFound() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm my-12 max-w-md mx-auto">
      <div className="text-4xl mb-3" aria-hidden="true">
        🔍
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        페이지를 찾을 수 없습니다.
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        도시 목록으로 돌아가기
      </Link>
    </div>
  );
}
