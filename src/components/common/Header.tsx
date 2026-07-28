import Link from 'next/link';

/**
 * 상단 헤더 컴포넌트
 */
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-1"
        >
          <span className="text-2xl font-bold tracking-tight">🌤️ Weather Pocket</span>
        </Link>
      </div>
    </header>
  );
}
