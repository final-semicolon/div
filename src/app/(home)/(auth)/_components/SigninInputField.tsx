import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import X from '@/assets/images/common/X';
import React, { useState, useRef, useEffect } from 'react';

type InputFieldProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  valid: boolean;
  message: string;
};

const SigninInputField = ({ type, value, onChange, placeholder, valid, message }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const messageColor = value ? (valid ? 'text-main-400' : 'text-red') : 'text-gray-900';
  const borderColor = value && !valid ? 'border-red' : isFocused ? 'border-main-400' : 'border-gray-300';
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setIsCapsLockOn(event.getModifierState('CapsLock'));
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      setIsCapsLockOn(event.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative mb-2">
      <div className={`border rounded w-full p-4 ${borderColor}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          ref={inputRef}
          className={` outline-transparent placeholder:body2-regular-16px`}
        />
        {(isFocused || value) && (
          <button
            type="button"
            onClick={handleClearInput}
            className="absolute right-3 top-5 text-gray-400 hover:text-black z-10"
          >
            <X />
          </button>
        )}
      </div>
      {(isFocused || value) && placeholder === '비밀번호를 한 번 더 입력해 주세요.' && (
        <div className="ml-1 my-2 flex items-center">
          <span>{isCapsLockOn ? <ReverseExclamation /> : <ReverseExclamation stroke="#423edf" />}</span>
          <span className={`ml-1 text-body2 font-regular ${isCapsLockOn ? 'text-red' : 'text-main-400'}`}>
            Caps Lock on
          </span>
        </div>
      )}
      <p className={`mt-1 body2-regular-16px ml-2 ${messageColor}`}>{message}</p>
    </div>
  );
};

export default SigninInputField;
