'use client';
import React from 'react';

type SignupButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
};

const SignupButton = ({ onClick, disabled }: SignupButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-3 rounded-md subtitle1-bold-18px  ${disabled ? 'bg-main-100 text-main-50' : 'bg-main-400 text-white '}`}
    >
      가입하기
    </button>
  );
};

export default SignupButton;
