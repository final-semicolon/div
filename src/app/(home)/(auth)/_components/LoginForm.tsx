'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/context/auth.context';
import OAuthButtons from './OAuthButtons';
import { createClient } from '@/supabase/client';
import Logo from '@/assets/images/header/Logo';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import X from '@/assets/images/common/X';

type LoginFormInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const { logIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    setFocus,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  const email = watch('email');
  const password = watch('password');

  const handleCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null);

    const isValid = await trigger();
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      setFocusedField(firstErrorKey);
      setFocus(firstErrorKey as keyof LoginFormInputs);
      return;
    }

    try {
      const response = await logIn(data.email, data.password);

      if (response.status === 200) {
        toast.success('로그인이 완료되었어요.', {
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

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white w-full max-w-sm">
        <div className="flex items-center justify-center mt-40 mb-16">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="text-center border-b-2 mb-16">
          <OAuthButtons handleLogin={handleOAuthLogin} title="SNS 계정으로 로그인/회원가입" />
        </div>
        {error && <p className="text-red mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <label
              className={`block subtitle2-bold-16px ${
                errors.email ? 'text-red' : focusedField === 'email' ? 'text-main-400' : 'text-gray-900'
              }`}
            >
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="이메일을 입력해 주세요"
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '유효한 이메일 주소를 입력해주세요.'
                  }
                })}
                className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:body2-regular-16px ${
                  errors.email
                    ? 'border-red'
                    : focusedField === 'email' || email
                      ? 'border-main-400'
                      : 'border-gray-900'
                }`}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={handleKeyDown}
              />
              {(email || focusedField === 'email') && (
                <button
                  type="button"
                  onMouseDown={() => setValue('email', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X />
                </button>
              )}
            </div>
          </div>
          <div className="mb-4 relative">
            <label
              className={`block subtitle2-bold-16px ${
                errors.password ? 'text-red' : focusedField === 'password' ? 'text-main-400' : 'text-gray-900'
              }`}
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  pattern: {
                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/,
                    message: '비밀번호는 영문, 숫자, 특수문자를 포함한 10자 이상이어야 합니다.'
                  }
                })}
                className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:body2-regular-16px ${
                  errors.password
                    ? 'border-red'
                    : focusedField === 'password' || password
                      ? 'border-main-400'
                      : 'border-gray-900'
                }`}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={handleCapsLock}
                onKeyUp={handleCapsLock}
                onKeyDownCapture={handleKeyDown}
              />
              {(password || focusedField === 'password') && (
                <button
                  type="button"
                  onMouseDown={() => setValue('password', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X />
                </button>
              )}
            </div>
            {isCapsLockOn && (
              <div className="ml-1 my-2 flex items-center">
                <ReverseExclamation stroke="#423EDF" />
                <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
              </div>
            )}
          </div>
          <button type="submit" className="w-full p-3 text-white rounded-md bg-main-400 hover:bg-main-500">
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="mt-4 text-center">
            <span>
              <Link className="body2-medium-16px text-gray-900" href="/signup">
                회원가입
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
