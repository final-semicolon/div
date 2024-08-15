'use client';

import Logo from '@/assets/images/header/Logo';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Header = () => {
  const { isLoggedIn, userData } = useAuth();
  const pathname = usePathname();

  const getLinkClasses = useCallback(
    (path: string) => (pathname === path ? 'text-h4 font-bold text-main-400' : 'text-h4 font-bold text-neutral-900'),
    [pathname]
  );

  return (
    <header className="bg-transparent h-[120px] w-full mt-[76px]">
      <div className="mx-auto flex items-center w-[1204px] justify-between">
        <div className="flex items-center mr-2">
          <Link href={'/'}>
            <div className="mt-[27.5px] mb-[27.5px] mr-2">
              <Logo />
            </div>
          </Link>
          <NavLinks getLinkClasses={getLinkClasses} />
          <SearchBar />
        </div>
        <UserMenu isLoggedIn={isLoggedIn} userData={userData} />
      </div>
    </header>
  );
};

export default memo(Header);
