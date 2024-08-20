'use client';

import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ArchiveBackground = () => {
  const pathname = usePathname();
  const [isArchivePage, setIsArchivePage] = useState(false);

  useEffect(() => {
    setIsArchivePage(pathname === '/archive');
  }, [pathname]);

  if (!isArchivePage) return null;
  return (
    <>
      <Default>
        <div className="absolute top-[850px] left-0 w-full bg-sub-50 z-[-1]" style={{ height: '676px' }} />
      </Default>
      <Mobile>
        <div className="absolute top-[470px] left-0 w-full bg-sub-50 z-[-1]" style={{ height: '453px' }} />
      </Mobile>
    </>
  );
};

export default ArchiveBackground;
