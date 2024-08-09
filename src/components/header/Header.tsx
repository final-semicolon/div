'use client';

import Logo from '@/assets/images/header/Logo';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Header = () => {
  const { isLoggedIn, userData } = useAuth();
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    return pathname === path ? 'text-h4 font-bold text-main-400' : 'text-h4 font-bold text-neutral-900';
  };

  return (
    <header className="bg-transparent h-[120px] w-full mt-[76px]">
      <div className="container mx-auto flex items-center">
        <div className="flex items-center ml-40">
          <div className="mt-[27.5px] mb-[27.5px] mr-2">
            <Link href={'/'}>
              <Logo />
            </Link>
          </div>
          <div className="my-8">
            <NavLinks getLinkClasses={getLinkClasses} />
          </div>
          <div className="mx-2">
            <SearchBar />
          </div>
        </div>
        <div className="w-[333px]">
          <UserMenu isLoggedIn={isLoggedIn} userData={userData} />
        </div>
      </div>
    </header>
  );
};

export default Header;
