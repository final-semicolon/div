'use client';

import { usePathname } from 'next/navigation';

type PaddingProps = {
  children: React.ReactNode;
};

const PaddingOrNot = ({ children }: PaddingProps) => {
  const pathname = usePathname();
  const isSearchOrForumPage = pathname === '/search' || pathname.startsWith('/forum/');
  return <div className={!isSearchOrForumPage ? 'md:pt-14 pt-6' : 'md:pt-14'}>{children}</div>;
};

export default PaddingOrNot;
