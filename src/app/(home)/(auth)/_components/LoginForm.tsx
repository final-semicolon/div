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
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

type LoginFormInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const { logIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

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

  const handleKeyEvents = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(event.getModifierState && event.getModifierState('CapsLock'));

    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null);

    const isValid = await trigger();
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
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

  const inputClassName = (field: string, value: string, error: any) =>
    `mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:body2-regular-16px ${
      error ? 'border-red' : value ? 'border-main-400' : 'border-gray-900'
    }`;

  return (
    <div className="flex items-center justify-center bg-white min-h-full">
      <Default>
        <div className="w-full max-w-sm ">
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
            <div className="mb-6 relative">
              <label className={`block subtitle2-bold-16px ${errors.email ? 'text-red' : 'text-gray-900'}`}>
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
                  className={inputClassName('email', email, errors.email)}
                  onKeyDown={handleKeyEvents}
                />
                {email && (
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
            <div className="mb-10 relative">
              <label className={`block subtitle2-bold-16px ${errors.password ? 'text-red' : 'text-gray-900'}`}>
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
                  className={inputClassName('password', password, errors.password)}
                  onKeyDown={handleKeyEvents}
                />
                {password && (
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
          <div className="mt-4 mb-[267px] mt-10 text-center">
            <span>
              <Link className="subtitle1-medium-18px text-gray-700 underline " href="/signup">
                이메일로 가입하기
              </Link>
            </span>
          </div>
        </div>
      </Default>
      <Mobile>
        <div className="w-[768px] ">
          <div className="flex items-center justify-center mt-[36px] mb-[80px]">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {error && <p className="text-red mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto flex flex-col items-center ">
              <div className="mb-5  ml-20 mr-20 relative">
                <label className={`block subtitle2-bold-16px ${errors.email ? 'text-red' : 'text-gray-900'}`}>
                  이메일
                </label>
                <div className="relative w-[335px] h-[44px]">
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
                    className={inputClassName('email', email, errors.email)}
                    onKeyDown={handleKeyEvents}
                  />
                  {email && (
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
              <div className=" relative  ml-20 mr-20">
                <label className={`block subtitle2-bold-16px ${errors.password ? 'text-red' : 'text-gray-900'}`}>
                  비밀번호
                </label>
                <div className="relative w-[335px] h-[44px] ">
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
                    className={inputClassName('password', password, errors.password)}
                    onKeyDown={handleKeyEvents}
                  />
                  {password && (
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
                  <div className="flex items-center">
                    <ReverseExclamation stroke="#423EDF" />
                    <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-[335px] h-[46px] ml-20 mr-20 p-3 mt-10 text-white rounded-md bg-main-400 hover:bg-main-500"
              >
                로그인
              </button>
              <div className="text-center border-t-2 mt-10 ml-20 mr-20  w-[335px] h-[124px]">
                <OAuthButtons handleLogin={handleOAuthLogin} title="SNS 계정으로 로그인/회원가입" />
              </div>
            </div>
          </form>
          <div className="mt-4 text-center">
            <span>
              <Link className="body4-regular-13px text-gray-500 underline " href="/signup">
                이메일로 가입하기
              </Link>
            </span>
          </div>
        </div>
      </Mobile>
    </div>
  );
}

export default LoginForm;
