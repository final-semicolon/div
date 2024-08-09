import { useState, useEffect } from 'react';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import X from '@/assets/images/common/X';
import CircleX from '@/assets/images/common/CircleX';
import { useAuth } from '@/context/auth.context';
import useCapsLock from '@/hooks/common/useCapsLock';

type CheckCurrentPasswordProps = {
  onValidationChange: (message: string) => void;
};

const CheckCurrentPassword = ({ onValidationChange }: CheckCurrentPasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { me } = useAuth();
  const isCapsLockOn = useCapsLock(isFocused);

  const handleValidatePassword = async (password: string) => {
    try {
      const response = await fetch('/api/profile/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword: password, email: me?.email })
      });

      const result = await response.json();
      if (result.valid) {
        setIsCurrentPasswordValid(true);
        setValidationMessage('기존 비밀번호가 확인되었습니다.');
      } else {
        setIsCurrentPasswordValid(false);
        setValidationMessage('비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setIsCurrentPasswordValid(false);
      setValidationMessage('서버 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (currentPassword.length > 0) {
      handleValidatePassword(currentPassword);
    } else {
      setIsCurrentPasswordValid(true);
      setValidationMessage('');
    }
    onValidationChange(validationMessage);
  }, [currentPassword, validationMessage]);

  return (
    <div className="h-[150px]">
      <p className="text-subtitle2 font-bold text-neutral-900 mb-1">기존 비밀번호</p>
      <div
        className={`relative flex items-center justify-between w-full max-w-lg h-14 p-4 border rounded mb-2 ${
          currentPassword.length === 0
            ? 'text-neutral-700 outline-neutral-400 border-neutral-300'
            : isCurrentPasswordValid
              ? 'text-neutral-900 outline-main-400 border-main-400'
              : 'text-red outline-red border-red'
        }`}
      >
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full outline-transparent"
          placeholder="비밀번호를 입력해 주세요."
        />
        {currentPassword && (
          <button type="button" onClick={() => setCurrentPassword('')} className="absolute right-4 text-gray-600">
            <X />
          </button>
        )}
      </div>

      {isCapsLockOn && (
        <div className="ml-1 my-2 flex items-center">
          <span>
            <ReverseExclamation stroke="#423edf" />
          </span>
          <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
        </div>
      )}

      {currentPassword.length > 3 && (
        <>
          <div className="flex items-center h-6">
            <span>{isCurrentPasswordValid ? <CircleX fill="#423EDF" /> : <CircleX fill="#f66161" />}</span>
            <span className={`text-body2 font-regular ${isCurrentPasswordValid ? 'text-main-400' : 'text-red'}`}>
              {validationMessage}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckCurrentPassword;
