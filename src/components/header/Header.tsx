'use client';

import Logo from '@/assets/images/header/Logo';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import MobileWriteButton from '@/assets/images/header/MobileWriteButton';
import MobileSearchButton from '@/assets/images/header/MobileSearchButton';
import MobileHamburgerButton from '@/assets/images/header/MobileHamburgerButton';
import MobileLogo from '@/assets/images/header/MobileLogo';
import HeaderModal from '../modal/HeaderModal';

const Header = () => {
  const { isLoggedIn, userData } = useAuth();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLinkClasses = useCallback(
    (path: string) => (pathname === path ? 'text-h4 font-bold text-main-400' : 'text-h4 font-bold text-neutral-900'),
    [pathname]
  );

  const getMobileLinkClasses = useCallback(
    (path: string) =>
      pathname === path
        ? 'text-body3 font-regular text-neutral-900 border-b-2 border-black'
        : 'text-body3 font-regular text-neutral-900',
    [pathname]
  );

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const hideNavLinks =
    ['/search'].includes(pathname) ||
    pathname.startsWith('/archive/') ||
    pathname.startsWith('/forum/') ||
    pathname.startsWith('/activities') ||
    pathname.startsWith('/profile');

  return (
    <>
      <Default>
        <header className="bg-transparent h-[120px] w-full mt-[76px]">
          <div className="mx-auto flex items-center max-w-[1204px] justify-between">
            <div className="flex items-center mr-2">
              <Link href={'/'}>
                <div className="mt-[27.5px] mb-[27.5px] mr-2">
                  <Logo />
                </div>
              </Link>
              <NavLinks getLinkClasses={getLinkClasses} />
              <div className="search-bar-hidden">
                <SearchBar />
              </div>
            </div>
            <div className="flex">
              <UserMenu isLoggedIn={isLoggedIn} userData={userData} />
            </div>
          </div>
        </header>
      </Default>
      <Mobile>
        <header className=" bg-transparent h-[107px] w-full min-w-[375px] flex flex-col items-center justify-between">
          <div className="w-full flex items-center max-w-[767px] justify-between mx-auto my-5 z-50">
            <Link href={'/'}>
              <div className="h-[40px] flex items-center flex-shrink-0 ml-5">
                <MobileLogo />
              </div>
            </Link>
            <div className="flex items-center space-x-4  flex-shrink-0 mr-5">
              <Link href="/write">
                <div className="h-6 w-6">
                  <Link href="/posting">
                    <MobileWriteButton />
                  </Link>
                </div>
              </Link>
              <Link href="/search">
                <div className="h-6 w-6">
                  <MobileSearchButton />
                </div>
              </Link>
              <button className="h-6 w-6" onClick={handleModalToggle}>
                <MobileHamburgerButton />
              </button>
            </div>
            <HeaderModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>
          {!hideNavLinks && (
            <div className="w-full mt-[9px] border-b">
              <NavLinks getLinkClasses={getMobileLinkClasses} />
            </div>
          )}
        </header>
      </Mobile>
    </>
  );
};

export default memo(Header);
