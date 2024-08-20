'use client';

import React from 'react';
import ProfileSidebar from './_components/ProfileSidebar';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import HaderMobile from './_components/SidebarResponsive/HaderMobile';

type ProfileLayoutProps = {
  children: React.ReactNode;
};

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="">
      <Default>
        <div className="flex h-screen">
          <ProfileSidebar />
          <main className="pr-10">{children}</main>
        </div>
      </Default>
      <Mobile>
        <div className="flex flex-col">
          <header className="w-full">
            <HaderMobile />
          </header>
          <main className="w-full">{children}</main>
        </div>
      </Mobile>
    </div>
  );
};

export default ProfileLayout;
