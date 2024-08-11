'use client';
import React from 'react';

type SignupButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const SignupButton = ({ onClick }: SignupButtonProps) => {
  return (
    <button onClick={onClick} className={`w-full p-3 rounded-md subtitle1-bold-18px bg-main-400 text-white`}>
      가입하기
    </button>
  );
};

export default SignupButton;
