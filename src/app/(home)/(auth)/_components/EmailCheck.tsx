'use client';
import React, { useEffect } from 'react';
import SigninInputField from './SigninInputField';

type EmailCheckProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailValid: boolean;
  setEmailValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCheckedEmail: React.Dispatch<React.SetStateAction<boolean>>;
  emailMessage: string;
  setEmailMessage: React.Dispatch<React.SetStateAction<string>>;
};

const EmailCheck = ({
  email,
  setEmail,
  emailValid,
  setEmailValid,
  setIsCheckedEmail,
  emailMessage,
  setEmailMessage
}: EmailCheckProps) => {
  useEffect(() => {
    const validateEmailFormat = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleValidateEmail = async (email: string) => {
      if (!validateEmailFormat(email)) {
        setEmailMessage('필수 입력 항목이에요.(또는 이메일 형식을 확인해주세요.)');
        setEmailValid(false);
        setIsCheckedEmail(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.status === 409) {
          setEmailMessage('이미 사용 중인 이메일이에요.');
          setEmailValid(false);
          setIsCheckedEmail(false);
        } else if (response.ok) {
          setEmailMessage('사용 가능한 이메일이에요.');
          setEmailValid(true);
          setIsCheckedEmail(true);
        } else {
          setEmailMessage(result.error || '이메일 확인 중 오류가 발생했어요.');
          setEmailValid(false);
          setIsCheckedEmail(false);
        }
      } catch (error) {
        setEmailMessage('이메일 확인 중 오류가 발생했어요.');
        setEmailValid(false);
        setIsCheckedEmail(false);
      }
    };

    if (email) {
      handleValidateEmail(email);
    } else {
      setEmailValid(false);
      setIsCheckedEmail(false);
      setEmailMessage('이메일을 입력해 주세요.');
    }
  }, [email, setIsCheckedEmail, setEmailMessage, setEmailValid]);

  return (
    <div className="mb-4 flex items-center space-x-2">
      <div className="flex-grow">
        <SigninInputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해 주세요."
          valid={emailValid}
          message={emailMessage}
        />
      </div>
    </div>
  );
};

export default EmailCheck;
