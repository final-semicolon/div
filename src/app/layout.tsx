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
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '400 500 700',
  variable: '--font-pretendard'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
