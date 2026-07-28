import Link from 'next/link';

export default function RegionNotFound() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm my-12 max-w-md mx-auto">
      <div className="text-4xl mb-3" aria-hidden="true">
        🏙️
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        지역을 찾을 수 없습니다.
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        요청하신 행정구역은 현재 서비스 제공 목록에 포함되어 있지 않습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        홈 화면으로 돌아가기
      </Link>
    </div>
  );
}
