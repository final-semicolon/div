import CircleX from '@/assets/images/common/CircleX';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import X from '@/assets/images/common/X';
import useCapsLock from '@/hooks/common/useCapsLock';
import { useState, useEffect } from 'react';

type NewPasswordProps = {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
};

const NewPassword = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange
}: NewPasswordProps) => {
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isCapsLockOn = useCapsLock(isFocused);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): boolean => {
    const minLength = 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasDigit && hasSpecialChar;
  };

  // 비밀번호 확인 검사
  useEffect(() => {
    if (confirmPassword.length > 0) {
      if (newPassword === confirmPassword) {
        setConfirmPasswordMessage('비밀번호가 일치합니다.');
      } else {
        setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.');
      }
    } else {
      setConfirmPasswordMessage('');
    }
  }, [newPassword, confirmPassword]);

  const isPasswordValid = validatePassword(newPassword);
  const isConfirmPasswordValid = newPassword === confirmPassword && confirmPassword.length > 0;

  return (
    <div className="mt-5">
      <p className="text-subtitle2 font-bold text-neutral-900">새로운 비밀번호</p>
      <div
        className={`relative block w-full max-w-lg h-14 p-4 border rounded mb-2 mt-2 ${
          isPasswordValid
            ? 'text-neutral-900 outline-main-400 border-main-400'
            : newPassword.length > 0
              ? 'text-red outline-red border-red'
              : 'text-neutral-700 outline-neutral-400 border-neutral-300'
        }`}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full outline-transparent"
          placeholder="새 비밀번호를 입력해 주세요."
        />
        {newPassword && (
          <>
            <button
              type="button"
              onClick={() => onNewPasswordChange('')}
              className="absolute right-4 top-5 text-gray-600"
            >
              <X />
            </button>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-12 text-gray-600"
            >
              {showPassword ? '숨기기' : '보기'}
            </button>
          </>
        )}
      </div>
      <div
        className={`relative block w-full max-w-lg h-14 p-4 border rounded ${
          confirmPasswordMessage === '비밀번호가 일치하지 않습니다.'
            ? 'text-red outline-red border-red'
            : isConfirmPasswordValid
              ? 'text-neutral-900 outline-main-400 border-main-400'
              : 'text-neutral-700 outline-neutral-400 border-neutral-300'
        }`}
      >
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full outline-transparent"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
        />
        {confirmPassword && (
          <>
            <button
              type="button"
              onClick={() => onConfirmPasswordChange('')}
              className="absolute right-4 top-5 text-gray-600"
            >
              <X />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-12 text-gray-600"
            >
              {showConfirmPassword ? '숨기기' : '보기'}
            </button>
          </>
        )}
      </div>
      {isCapsLockOn ? (
        <div className="ml-1 my-2 flex items-center">
          <span>
            <ReverseExclamation stroke="#423edf" />
          </span>
          <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
        </div>
      ) : (
        ''
      )}
      <div className="flex flex-col">
        {confirmPasswordMessage === '비밀번호가 일치하지 않습니다.' ? (
          <div className="flex items-center my-2">
            <span>
              <CircleX fill="#f66161" />
            </span>
            <span className="text-red ml-2">{confirmPasswordMessage}</span>
          </div>
        ) : (
          <div className="flex items-center my-2">
            <span>{confirmPassword !== '' && <CircleX fill="#423edf" />}</span>
            <span className="text-main-400 ml-2">{confirmPasswordMessage}</span>
          </div>
        )}
        {newPassword.length > 0 && newPassword === confirmPassword ? (
          <div className="flex items-center">
            <span>{isPasswordValid ? <CircleX fill="#423EDF" /> : <CircleX fill="#f66161" />}</span>
            <span className={`ml-2 ${isPasswordValid ? 'text-main-400' : 'text-red'}`}>
              영문/숫자/특수문자 혼합(10자 이상)
            </span>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default NewPassword;
