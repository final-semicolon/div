'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ArchiveBackground = () => {
  const pathname = usePathname();
  const [isArchivePage, setIsArchivePage] = useState(false);

  useEffect(() => {
    setIsArchivePage(pathname === '/archive');
  }, [pathname]);

  if (!isArchivePage) return null;
  return <div className="absolute top-[850px] left-0 w-full bg-sub-50 z-[-1]" style={{ height: '676px' }} />;
};

export default ArchiveBackground;
