import React from 'react';
import OAuthNicknameModalWrapper from './(auth)/_components/OAuthNicknameModalWrapper';
import HeaderWrapper from '@/components/header/HeaderWrapper';
import QnaBackground from './_components/QnaBackground';

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <QnaBackground />
      <HeaderWrapper />
      <div className="flex justify-center flex-1 w-full">
        <main className="w-[1204px] pt-14">{children}</main>
      </div>
      <OAuthNicknameModalWrapper />
    </div>
  );
};

export default HomeLayout;
