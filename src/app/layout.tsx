import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';

export const metadata: Metadata = {
  title: 'Weather Pocket - 대한민국 주요 도시 날씨 정보',
  description:
    '여러 도시의 현재 날씨와 주간 예보를 확인하고 관심 도시를 저장하는 날씨 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
