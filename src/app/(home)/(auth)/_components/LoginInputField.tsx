import RedX from '@/assets/images/auth/RedX';
import X from '@/assets/images/common/X';
import React, { useState, useRef, useEffect } from 'react';

type LoginInputFieldProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  valid: boolean;
  message: string;
  label: string;
};

const LoginInputField = ({ type, value, onChange, placeholder, valid, message, label }: LoginInputFieldProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const borderColor = !value
    ? 'border-gray-900'
    : !valid
      ? 'border-red'
      : isFocused
        ? 'border-main-400'
        : 'border-gray-900';

  const labelColor = !value ? 'text-gray-900' : !valid ? 'text-red' : isFocused ? 'text-main-400' : 'text-gray-900';

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-6">
      <label className={`block mb-2 ${labelColor}`}>{label}</label>
      <div className={`border rounded w-full p-4 ${borderColor} relative`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          ref={inputRef}
          className="outline-none w-full placeholder:body2-regular-16px pr-10"
        />
        {(isFocused || value) && (
          <button
            type="button"
            onClick={handleClearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-black z-10"
            style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <X />
          </button>
        )}
      </div>
      {!valid && message && (
        <div className="ml-1 my-2 flex items-center">
          <RedX />
          <span className="mt-1 body2-regular-16px ml-2 text-red">{message}</span>
        </div>
      )}
    </div>
  );
};

export default LoginInputField;
