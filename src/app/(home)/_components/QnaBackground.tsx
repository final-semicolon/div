'use client';

import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const QnaBackground = () => {
  const pathname = usePathname();
  const [isQnaPage, setIsQnaPage] = useState(false);

  useEffect(() => {
    setIsQnaPage(pathname === '/qna' || pathname.startsWith('/qna'));
  }, [pathname]);

  if (!isQnaPage) return null;
  return (
    <>
      <Default>
        <div className="absolute top-0 left-0 w-full bg-sub-50 z-[-1]" style={{ height: '408px' }} />
      </Default>
      <Mobile>
        <div className="absolute top-0 left-0 w-full bg-sub-50 z-[-1]" style={{ height: '180px' }} />
      </Mobile>
    </>
  );
};

export default QnaBackground;
