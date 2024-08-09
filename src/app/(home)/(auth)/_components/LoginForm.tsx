'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/context/auth.context';
import OAuthButtons from './OAuthButtons';
import { createClient } from '@/supabase/client';
import Logo from '@/assets/images/header/Logo';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import LoginInputField from './LoginInputField';
import BackClick from '../../(posts)/_components/archive-detail/BackClick';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { logIn } = useAuth();

  const [emailValid, setEmailValid] = useState<boolean>(false); // 초기값 false로 설정
  const [emailMessage, setEmailMessage] = useState<string>('');

  const [passwordValid, setPasswordValid] = useState<boolean>(false); // 초기값 false로 설정
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!validateEmail(emailValue)) {
      setEmailValid(false);
      setEmailMessage('이메일 형식을 확인해 주세요');
    } else {
      setEmailValid(true);
      setEmailMessage('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (!validatePassword(passwordValue)) {
      setPasswordValid(false);
      setPasswordMessage('비밀번호를 확인해 주세요');
    } else {
      setPasswordValid(true);
      setPasswordMessage('');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!emailValid || !passwordValid) {
      toast.error('입력한 내용을 확인해주세요.');
      return;
    }

    try {
      const response = await logIn(email, password);

      if (response.status === 200) {
        toast.success('로그인이 완료되었어요', {
          autoClose: 2000,
          onClose: () => router.replace('/')
        });
      } else {
        setError('로그인 실패');
        toast.error('로그인 중 에러가 발생했어요.');
      }
    } catch (err) {
      setError('로그인 실패');
      toast.error('로그인 중 에러가 발생했어요.');
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'github') => {
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_BASE_URL
        }
      });

      if (error) {
        setError(`Failed to log in with ${provider}. ${error.message}`);
        toast.error(`Failed to log in with ${provider}.`);
      } else {
        localStorage.setItem('oauthProvider', provider);
      }
    } catch (err) {
      setError('OAuth 로그인 실패');
      toast.error('OAuth 로그인 중 에러가 발생했습니다.');
    }
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

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white w-full max-w-sm">
        <BackClick />
        <div className="flex items-center justify-center mt-40 mb-16">
          <Logo />
        </div>
        {error && <p className="text-red mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <LoginInputField
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일"
              valid={emailValid}
              message={emailMessage}
              label="이메일"
            />
          </div>
          <div className="mb-4">
            <LoginInputField
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              valid={passwordValid}
              message={passwordMessage}
              label="비밀번호"
            />
            {isCapsLockOn && (
              <div className="ml-1 my-2 flex items-center">
                <ReverseExclamation stroke="#423EDF" />
                <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full p-3 text-white rounded-md ${emailValid && passwordValid ? 'bg-main-400 hover:bg-main-500' : 'bg-main-100 cursor-not-allowed'}`}
            disabled={!emailValid || !passwordValid}
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="mt-4 text-center">
            <span className="mr-4">
              <Link className="body2-medium-16px " href="/signup">
                비밀번호 재설정
              </Link>
            </span>
            <span>
              <Link className="body2-medium-16px " href="/signup">
                회원가입
              </Link>
            </span>
          </p>
        </div>
        <div className="border-t-2 mt-8">
          <OAuthButtons handleLogin={handleOAuthLogin} title="SNS 계정으로 로그인/회원가입" />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
