import React from 'react';
import SigninInputField from './SigninInputField';

type PasswordFieldsProps = {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  passwordValid: boolean;
  confirmPasswordValid: boolean;
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
  return (
    <div>
      <SigninInputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력해 주세요."
        valid={passwordValid}
        message={passwordMessage}
      />
      <SigninInputField
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="비밀번호를 한 번 더 입력해 주세요."
        valid={confirmPasswordValid}
        message={confirmPasswordMessage}
      />
      <div className="text-sm text-gray-600 mb-3">영문/숫자/특수문자 혼합 (10자 이상)</div>
    </div>
  );
};

export default PasswordFields;
