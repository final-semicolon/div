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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<{ password: boolean; confirmPassword: boolean }>({
    password: false,
    confirmPassword: false
  });
  const inputRefs = {
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null)
  };
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>, inputType: 'password' | 'confirmPassword') => {
    e.preventDefault();
    if (inputType === 'password') {
      setPassword('');
    } else {
      setConfirmPassword('');
    }
    inputRefs[inputType].current?.focus();
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

  const renderInputField = (
    type: 'password' | 'confirmPassword',
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    valid: boolean | null
  ) => {
    const borderColor = value && !valid ? 'border-red' : isFocused[type] ? 'border-main-400' : 'border-gray-300';

    return (
      <div className="relative mb-2">
        <div className={`border rounded w-full p-4 ${borderColor}`}>
          <input
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : showConfirmPassword ? 'text' : 'password'
            }
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused((prev) => ({ ...prev, [type]: true }))}
            onBlur={() => setIsFocused((prev) => ({ ...prev, [type]: false }))}
            placeholder={placeholder}
            ref={inputRefs[type]}
            className="outline-transparent placeholder:body2-regular-16px w-full"
            style={{ width: '100%' }}
          />
          {(isFocused[type] || value) && (
            <>
              <button
                type="button"
                onClick={(e) => handleClearInput(e, type)}
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
                {type === 'password' ? (showPassword ? '숨기기' : '보기') : showConfirmPassword ? '숨기기' : '보기'}
              </button>
            </>
          )}
        </div>
        {(isFocused.password || isFocused.confirmPassword) &&
          type === 'confirmPassword' &&
          (isCapsLockOn ? (
            <div className="ml-1 my-2 flex items-center">
              <span>
                <ReverseExclamation stroke="#423EDF" />
              </span>
              <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
            </div>
          ) : (
            ''
          ))}
      </div>
    );
  };

  const renderValidationMessage = (
    type: 'password' | 'confirmPassword',
    message: string,
    valid: boolean | null,
    value: string,
    isFocused: boolean
  ) => {
    if (!value) {
      return (
        <div className="ml-1 my-2 flex items-center">
          <span>
            <Vector />
          </span>
          <p className="mt-1 body2-regular-16px ml-2 text-gray-900">{message}</p>
        </div>
      );
    }

    let messageColor = 'text-gray-900';
    let icon = <Vector />;

    if (valid === true) {
      messageColor = 'text-main-400';
      icon = <CheckVector />;
    } else if (valid === false) {
      messageColor = 'text-red';
      icon = <RedX />;
    }

    return (
      <div className="ml-1 my-2 flex items-center">
        <span>{icon}</span>
        <p className={`mt-1 body2-regular-16px ml-2 ${messageColor}`}>{message}</p>
      </div>
    );
  };

  // 포커스된 입력 필드에 따라 라벨 색상 결정
  const labelColor =
    !password && !confirmPassword
      ? 'text-gray-900' // 둘 다 초기 빈 값일 때 회색
      : isFocused.password
        ? passwordValid === false
          ? 'text-red'
          : passwordValid === true
            ? 'text-main-400'
            : 'text-gray-900'
        : isFocused.confirmPassword
          ? confirmPasswordValid === false
            ? 'text-red'
            : confirmPasswordValid === true
              ? 'text-main-400'
              : 'text-gray-900'
          : 'text-gray-900';

  return (
    <div>
      <label className={`text-body2 font-bold mb-2 ${labelColor}`}>비밀번호</label>
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
      </div>
      {renderValidationMessage(
        'password',
        passwordMessage || '영문/숫자/특수문자 혼합 (10자 이상)',
        passwordValid,
        password,
        isFocused.password
      )}
      {renderValidationMessage(
        'confirmPassword',
        confirmPasswordMessage || '비밀번호를 한번 더 입력해주세요.',
        confirmPasswordValid,
        confirmPassword,
        isFocused.confirmPassword
      )}
    </div>
  );
};

export default PasswordFields;
