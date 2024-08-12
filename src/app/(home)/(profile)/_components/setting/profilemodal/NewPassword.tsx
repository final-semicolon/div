import CircleX from '@/assets/images/common/CircleX';
import { PASSWORD } from '@/constants/auth';
import { getStyles } from '@/utils/profileStyles';
import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import CapsLock from '@/components/common/CapsLock';

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

  // 비밀번호 확인 검사
  useEffect(() => {
    if (confirmPassword.length > 0) {
      if (newPassword === confirmPassword) {
        setConfirmPasswordMessage(PASSWORD.MATCH);
      } else {
        setConfirmPasswordMessage(PASSWORD.MISMATCH);
      }
    } else {
      setConfirmPasswordMessage('');
    }
  }, [newPassword, confirmPassword]);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): boolean => {
    const minLength = 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasDigit && hasSpecialChar;
  };

  const isPasswordValid = validatePassword(newPassword);
  const isConfirmPasswordValid = newPassword === confirmPassword && confirmPassword.length > 0;

  const newPasswordStyles = getStyles({
    isConditionsNotMetOnBlur: !isFocused && !isPasswordValid && newPassword.length !== 0,
    isConditionsMetOnBlur: !isFocused && isPasswordValid,
    isConditionsNotMetOnFocus: isFocused && !isPasswordValid && newPassword.length !== 0,
    isConditionsMetOnFocus: isFocused && isPasswordValid
  });

  const confirmPasswordStyles = getStyles({
    isConditionsNotMetOnBlur: !isFocused && confirmPasswordMessage === PASSWORD.MISMATCH,
    isConditionsMetOnBlur: !isFocused && isConfirmPasswordValid,
    isConditionsNotMetOnFocus: isFocused && confirmPasswordMessage === PASSWORD.MISMATCH,
    isConditionsMetOnFocus: isFocused && isConfirmPasswordValid
  });

  return (
    <div className="mt-5">
      <p className="text-subtitle2 font-bold text-neutral-900">새로운 비밀번호</p>
      <PasswordInput
        value={newPassword}
        onChange={onNewPasswordChange}
        placeholder={PASSWORD.PASSWORD_PLACEHOLDER}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        onClear={() => onNewPasswordChange('')}
        color={newPasswordStyles.borderColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <PasswordInput
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        placeholder={PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
        showPassword={showConfirmPassword}
        onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        onClear={() => onConfirmPasswordChange('')}
        color={confirmPasswordStyles.borderColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <CapsLock isFocused={isFocused} />
      <div className="flex flex-col">
        {confirmPasswordMessage && (
          <div className="flex items-center my-2">
            <span>
              <CircleX fill={confirmPasswordMessage === PASSWORD.MISMATCH ? '#f66161' : '#423edf'} />
            </span>
            <span className={`ml-2 ${confirmPasswordMessage === PASSWORD.MISMATCH ? 'text-red' : 'text-main-400'}`}>
              {confirmPasswordMessage}
            </span>
          </div>
        )}
        {newPassword.length > 0 && (
          <div className="flex items-center">
            <span>
              <CircleX fill={newPasswordStyles.stroke} />
            </span>
            <span className={`ml-2 ${newPasswordStyles.conditionTextColor}`}>영문/숫자/특수문자 혼합(10자 이상)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPassword;
