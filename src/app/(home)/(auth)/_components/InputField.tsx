import CheckError from '@/assets/images/auth/CheckError';
import CheckVector from '@/assets/images/auth/CheckVector';
import RedX from '@/assets/images/auth/RedX';
import Vector from '@/assets/images/auth/Vector';
import X from '@/assets/images/common/X';
import React, { useState, useRef, useEffect } from 'react';

type InputFieldProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  valid: boolean;
  message: string;
  label: string; // 라벨 텍스트를 추가하기 위한 필드
};

const InputField = ({ type, value, onChange, placeholder, valid, message, label }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasInput, setHasInput] = useState<boolean>(false);
  const messageColor = value ? (valid ? 'text-main-400' : 'text-red') : 'text-gray-900';
  const borderColor = value && !valid ? 'border-red' : isFocused ? 'border-main-400' : 'border-gray-300';

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();
  };

  useEffect(() => {
    setHasInput(value.length > 0);
  }, [value]);

  return (
    <div className="relative mb-6">
      <label className="block text-gray-700 subtitle2-bold-16px font-bold mb-2">{label}</label>
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
            className="absolute right-4 top-1/5 text-gray-400 hover:text-black z-10"
          >
            <X />
          </button>
        )}
      </div>
      <div className="ml-1 my-2 flex items-center">
        {!hasInput ? <Vector /> : valid === true ? <CheckVector /> : valid === false ? <RedX /> : <CheckError />}
        <span className={`mt-1 body2-regular-16px ml-2 ${messageColor}`}>{message}</span>
      </div>
    </div>
  );
};

export default InputField;
