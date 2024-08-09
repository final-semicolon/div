import React, { useState, useRef, useEffect } from 'react';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import X from '@/assets/images/common/X';
import Vector from '@/assets/images/auth/Vector';
import CheckVector from '@/assets/images/auth/CheckVector';
import RedX from '@/assets/images/auth/RedX';

type PasswordFieldsProps = {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  passwordValid: boolean | null;
  confirmPasswordValid: boolean | null;
  passwordMessage: string;
  confirmPasswordMessage: string;
};

const PasswordFields = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordValid,
  confirmPasswordValid,
  passwordMessage,
  confirmPasswordMessage
}: PasswordFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ password: false, confirmPassword: false });
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const inputRefs = {
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null)
  };

  useEffect(() => {
    const handleCapsLock = (event: KeyboardEvent) => {
      setIsCapsLockOn(event.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);
    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);

  const handleClearInput = (inputType: 'password' | 'confirmPassword') => {
    if (inputType === 'password') setPassword('');
    else setConfirmPassword('');
    inputRefs[inputType].current?.focus();
  };

  const renderInputField = (
    type: 'password' | 'confirmPassword',
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    valid: boolean | null
  ) => {
    const isFocusedOrFilled = isFocused[type] || value;
    const borderColor = !valid && value ? 'border-red' : isFocused[type] ? 'border-main-400' : 'border-gray-300';

    return (
      <div className="relative mb-2">
        <div className={`border rounded w-full p-4 ${borderColor}`}>
          <input
            type={
              (type === 'password' && showPassword) || (type === 'confirmPassword' && showConfirmPassword)
                ? 'text'
                : 'password'
            }
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused((prev) => ({ ...prev, [type]: true }))}
            onBlur={() => setIsFocused((prev) => ({ ...prev, [type]: false }))}
            placeholder={placeholder}
            ref={inputRefs[type]}
            className="outline-transparent placeholder:body2-regular-16px w-full"
          />
          {isFocusedOrFilled && (
            <>
              <button
                type="button"
                onClick={() => handleClearInput(type)}
                className="absolute right-4 top-5 text-gray-400 hover:text-black z-10"
              >
                <X />
              </button>
              <button
                type="button"
                onClick={() =>
                  type === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-12 text-gray-600"
              >
                {(type === 'password' && showPassword) || (type === 'confirmPassword' && showConfirmPassword)
                  ? '숨기기'
                  : '보기'}
              </button>
            </>
          )}
        </div>
        {isCapsLockOn && type === 'confirmPassword' && isFocused.confirmPassword && (
          <div className="ml-1 my-2 flex items-center">
            <ReverseExclamation stroke="#423EDF" />
            <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
          </div>
        )}
      </div>
    );
  };

  const renderValidationMessage = (message: string, valid: boolean | null, value: string) => {
    if (!value) {
      return (
        <div className="ml-1 my-2 flex items-center">
          <Vector />
          <p className="mt-1 body2-regular-16px ml-2 text-gray-900">{message}</p>
        </div>
      );
    }

    const messageColor = valid ? 'text-main-400' : 'text-red';
    const icon = valid ? <CheckVector /> : <RedX />;

    return (
      <div className="ml-1 my-2 flex items-center">
        <span>{icon}</span>
        <p className={`mt-1 body2-regular-16px ml-2 ${messageColor}`}>{message}</p>
      </div>
    );
  };

  return (
    <div>
      {renderInputField(
        'password',
        password,
        (e) => setPassword(e.target.value),
        '비밀번호를 입력해 주세요.',
        passwordValid
      )}
      {renderInputField(
        'confirmPassword',
        confirmPassword,
        (e) => setConfirmPassword(e.target.value),
        '비밀번호를 한 번 더 입력해 주세요.',
        confirmPasswordValid
      )}
      {renderValidationMessage(passwordMessage || '영문/숫자/특수문자 혼합 (10자 이상)', passwordValid, password)}
      {renderValidationMessage(
        confirmPasswordMessage || '비밀번호를 한번 더 입력해주세요.',
        confirmPasswordValid,
        confirmPassword
      )}
    </div>
  );
};

export default PasswordFields;
