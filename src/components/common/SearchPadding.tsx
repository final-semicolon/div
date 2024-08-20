'use client';

import { usePathname } from 'next/navigation';

type SearchPaddingProps = {
  children: React.ReactNode;
};

const SearchPadding = ({ children }: SearchPaddingProps) => {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';
  return <div className={!isSearchPage ? 'md:pt-14 pt-6' : ''}>{children}</div>;
};

export default SearchPadding;
