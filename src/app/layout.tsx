import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';
import 'react-toastify/dist/ReactToastify.css';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: '<div>',
  description: '프론트엔드 개발자 커뮤니티'
};

const pretendard = localFont({
  src: [{ path: '../assets/fonts/subset-PretendardVariable-Regular.woff2', weight: '400 500 700' }],
  display: 'swap',
  variable: '--font-pretendard'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
