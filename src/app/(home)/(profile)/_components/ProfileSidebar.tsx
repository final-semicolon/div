'use client';

import { useAuth } from '@/context/auth.context';
import { Desktop, Mobile, Tablet } from '@/hooks/common/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import SidebarDesktop from './SidebarResponsive/SidebarDesktop';
import SidebarTablet from './SidebarResponsive/SidebarTablet';
import { useState } from 'react';
import MobileHamburgerButton from '@/assets/images/header/MobileHamburgerButton';

const ProfileSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathname?.split('/')[2] || 'profile';
  const { userData, logOut } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = async () => {
    const result = await logOut();
    if (result.status === 200) {
      router.push('/');
    } else {
      toast.error(result.message || '로그아웃에 실패했습니다.');
    }
  };

  return (
    <>
      <Desktop>
        <SidebarDesktop userData={userData} currentPage={currentPage} handleLogout={handleLogout} />
      </Desktop>
      <Tablet>
        <div className="relative">
          <button aria-label="HamburgerButton" onClick={toggleSidebar} className="absolute p-4">
            <MobileHamburgerButton />
          </button>
          {isSidebarVisible && (
            <div className="z-50">
              <SidebarTablet
                userData={userData}
                currentPage={currentPage}
                handleLogout={handleLogout}
                handleClose={toggleSidebar}
              />
            </div>
          )}
        </div>
      </Tablet>
    </>
  );
};

export default ProfileSidebar;
