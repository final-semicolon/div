import Github from '@/assets/images/auth/Github';
import Google from '@/assets/images/auth/Google';
import Kakao from '@/assets/images/auth/Kakao';
import React from 'react';

type OAuthButtonsProps = {
  handleLogin: (provider: 'google' | 'kakao' | 'github') => void;
  title?: string;
};

const OAuthButtons = ({ handleLogin, title }: OAuthButtonsProps) => {
  return (
    <div className="mb-5 text-center">
      <p className="subtitle1-medium-18px mt-5 mb-6 text-gray-600">{title}</p>
      <div className="flex justify-center gap-6">
        <button onClick={() => handleLogin('google')} className=" rounded-full flex items-center justify-center ">
          <Google />
        </button>
        <button onClick={() => handleLogin('kakao')} className=" rounded-full flex items-center justify-center ">
          <Kakao />
        </button>
        <button onClick={() => handleLogin('github')} className="rounded-full flex items-center justify-center ">
          <Github />
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
