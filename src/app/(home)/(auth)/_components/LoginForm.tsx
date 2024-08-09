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
import InputField from './InputField';
function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { logIn } = useAuth();

  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [emailMessage, setEmailMessage] = useState<string>('');

  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setEmailValid(false);
      setEmailMessage('유효하지 않은 이메일 형식이에요.');
      toast.error('유효하지 않은 이메일 형식이에요.');
      return;
    } else {
      setEmailValid(true);
      setEmailMessage('');
    }

    if (password.length < 6) {
      setPasswordValid(false);
      setPasswordMessage('비밀번호는 6자 이상 입력해주세요.');
      toast.error('비밀번호는 6자 이상 입력해주세요.');
      return;
    } else {
      setPasswordValid(true);
      setPasswordMessage('');
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'github') => {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    <div className="flex items-center justify-center min-h-full ">
      <div className="bg-white w-full max-w-sm">
        <div className="flex items-center justify-center mt-40 mb-16">
          <Logo />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              valid={emailValid}
              message={emailMessage}
              label="이메일"
            />
          </div>
          <div className="mb-4">
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              valid={passwordValid}
              message={passwordMessage}
              label="비밀번호"
            />
          </div>
          {isCapsLockOn ? (
            <div className="ml-1 my-2 flex items-center">
              <span>
                {' '}
                <ReverseExclamation stroke="#423EDF" />{' '}
              </span>
              <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
            </div>
          ) : (
            ''
          )}
          <button type="submit" className="w-full p-3 bg-main-100 hover:bg-main-400 text-white rounded-md">
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="mt-4 text-center">
            혹시 계정이 없으신가요?
            <Link className="body2-medium-16px underline" href="/signup">
              회원가입
            </Link>
          </p>
        </div>
        <div className="border-t-2 mt-8">
          <OAuthButtons handleLogin={handleOAuthLogin} />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
