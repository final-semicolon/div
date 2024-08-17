import React from 'react';
import OAuthNicknameModalWrapper from './(auth)/_components/OAuthNicknameModalWrapper';
import HeaderWrapper from '@/components/header/HeaderWrapper';
import QnaBackground from './_components/QnaBackground';
import ArchiveBackground from './_components/ArchiveBackground';

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <QnaBackground />
      <HeaderWrapper />
      <div className="flex justify-center flex-1 w-full" data-color-mode="light">
        <main className="w-[1204px] pt-14">
          {children}
          <ArchiveBackground />
        </main>
      </div>
      <OAuthNicknameModalWrapper />
    </div>
  );
};

export default HomeLayout;
