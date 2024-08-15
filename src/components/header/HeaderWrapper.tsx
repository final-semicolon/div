'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { memo } from 'react';

const HeaderWrapper = () => {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  return !isAuthPage ? <Header /> : null;
};

export default memo(HeaderWrapper);
