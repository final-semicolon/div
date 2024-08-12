import { useState, useEffect } from 'react';
import CircleX from '@/assets/images/common/CircleX';
import { useAuth } from '@/context/auth.context';
import { PASSWORD } from '@/constants/auth';
import { getStyles } from '@/utils/profileStyles';
import useDebounce from '@/hooks/common/useDebounce';
import PasswordInput from './PasswordInput';
import CapsLock from '@/components/common/CapsLock';

type CheckCurrentPasswordProps = {
  onValidationChange: (message: string) => void;
};

const CheckCurrentPassword = ({ onValidationChange }: CheckCurrentPasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const { me } = useAuth();
  const debouncedCurrentPassword = useDebounce(currentPassword, 300);

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
        setValidationMessage(PASSWORD.CONFIRMED);
      } else {
        setValidationMessage(PASSWORD.MISMATCH);
      }
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };

  useEffect(() => {
    if (currentPassword.length > 0) {
      handleValidatePassword(debouncedCurrentPassword);
    } else {
      setValidationMessage('');
    }
    onValidationChange(validationMessage);
  }, [debouncedCurrentPassword, validationMessage]);

  const { titleTextColor, conditionTextColor, stroke, borderColor } = getStyles({
    isConditionsNotMetOnBlur: !isFocused && currentPassword.length !== 0 && validationMessage === PASSWORD.MISMATCH,
    isConditionsMetOnBlur: !isFocused && currentPassword.length !== 0,
    isConditionsNotMetOnFocus: isFocused && validationMessage === PASSWORD.MISMATCH,
    isConditionsMetOnFocus: isFocused && validationMessage === PASSWORD.CONFIRMED
  });

  return (
    <div className="h-[150px]">
      <p className={`text-subtitle2 font-bold text-neutral-900 mb-1 ${titleTextColor}`}>기존 비밀번호</p>

      <PasswordInput
        value={currentPassword}
        onChange={setCurrentPassword}
        placeholder={PASSWORD.PASSWORD_PLACEHOLDER}
        showPassword={showCurrentPassword}
        onToggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        onClear={() => setCurrentPassword('')}
        color={borderColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <CapsLock isFocused={isFocused} />
      {validationMessage && (
        <div className="flex items-center h-6">
          <span>
            <CircleX fill={stroke} />
          </span>
          <span className={`text-body2 font-regular ${conditionTextColor}`}>{validationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CheckCurrentPassword;
