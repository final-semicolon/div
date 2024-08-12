import React from 'react';
import ProfileSidebar from './_components/ProfileSidebar';

type ProfileLayoutProps = {
  children: React.ReactNode;
};

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[250px] fixed h-screen">
        <ProfileSidebar />
      </aside>
      <div className="flex-1 ml-[250px]">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default ProfileLayout;
