'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Header from './Header';
import { memo } from 'react';

const HeaderWrapper = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isActuallySearch = pathname === '/search' && searchParams.toString() === '';

  if (isAuthPage || isActuallySearch) {
    return null;
  }

  return <Header />;
};

export default memo(HeaderWrapper);
