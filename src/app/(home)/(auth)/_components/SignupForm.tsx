'use client';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import useOAuthLogin from '@/hooks/common/useOAuthLogin';
import OAuthButtons from './OAuthButtons';
import CheckboxGroup from './CheckboxGroup';
import Link from 'next/link';
import Logo from '@/assets/images/header/Logo';
import RedX from '@/assets/images/auth/RedX';
import X from '@/assets/images/common/X';
import I from '@/assets/images/common/I';
import CheckVector from '@/assets/images/auth/CheckVector';
import { isNicknameValid } from '@/utils/validateBannedWords';
import debounce from 'lodash/debounce';
import RedI from '@/assets/images/auth/RedI';
import ReverseExclamation from '@/assets/images/common/ReverseExclamation';

type SignupFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  terms: boolean;
  privacy: boolean;
  recaptcha?: string;
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const SignupForm = () => {
  const methods = useForm<SignupFormInputs>();
  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;
  const router = useRouter();
  const { signUp } = useAuth();
  const { handleOAuthLogin } = useOAuthLogin();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [nicknameValid, setNicknameValid] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  const email = watch('email', '');
  const nickname = watch('nickname', '');
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const checkNickname = debounce(async (nickname: string) => {
    if (!nickname) return;

    if (!isNicknameValid(nickname)) {
      setError('nickname', { type: 'manual', message: '사용할 수 없는 닉네임이에요' });
      setNicknameValid(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname })
      });

      const result = await response.json();

      if (response.status === 409) {
        setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임이에요' });
        setNicknameValid(false);
      } else if (response.ok) {
        clearErrors('nickname');
        setNicknameValid(true);
      } else {
        setError('nickname', { type: 'manual', message: result.error || '닉네임 확인 중 오류가 발생했어요' });
        setNicknameValid(false);
      }
    } catch (error) {
      setError('nickname', { type: 'manual', message: '닉네임 확인 중 오류가 발생했어요' });
      setNicknameValid(false);
    }
  }, 500);

  const checkEmail = debounce(async (email: string) => {
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('email', { type: 'manual', message: '유효한 이메일 주소를 입력해주세요' });
      setEmailValid(false);
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
        setError('email', { type: 'manual', message: '이미 사용 중인 이메일이에요' });
        setEmailValid(false);
      } else if (response.ok) {
        clearErrors('email');
        setEmailValid(true);
      } else {
        setError('email', { type: 'manual', message: result.error || '이메일 확인 중 오류가 발생했어요' });
        setEmailValid(false);
      }
    } catch (error) {
      setError('email', { type: 'manual', message: '이메일 확인 중 오류가 발생했어요' });
      setEmailValid(false);
    }
  }, 500);

  useEffect(() => {
    if (nickname) {
      checkNickname(nickname);
    } else {
      clearErrors('nickname');
    }
  }, [nickname]);

  useEffect(() => {
    if (email) {
      checkEmail(email);
    } else {
      clearErrors('email');
    }
  }, [email]);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    await Promise.all([checkEmail(data.email), checkNickname(data.nickname)]);

    if (!emailValid || !nicknameValid) {
      setError('email', { type: 'manual', message: '이미 사용 중인 이메일이에요' });
      setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임이에요' });
      return;
    }

    if (!recaptchaToken) {
      setError('recaptcha', { type: 'manual', message: '로봇이 아님을 확인해 주세요' });
      return;
    }

    if (data.password !== data.confirmPassword) {
      return;
    }
    setShowError(true);
    const result = await signUp(data.email, data.password, data.nickname, recaptchaToken);

    if (result.status === 200) {
      toast.success('회원가입이 완료되었어요!', {
        autoClose: 2000,
        onClose: () => router.replace('/')
      });
    } else {
    }
  };

  const preventSpaceInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  const isPasswordValid = password && /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/.test(password);
  const isConfirmPasswordValid = confirmPassword && confirmPassword === password;
  const isNicknameValidLocal = nickname && nickname.length >= 2 && nickname.length <= 12 && isNicknameValid(nickname);

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center min-h-full">
        <div className="bg-white w-full max-w-[420px]">
          <div className="flex items-center justify-center mb-[120px]">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="text-center border-b-2 mb-16">
            <OAuthButtons title="SNS 계정으로 회원가입" handleLogin={handleOAuthLogin} />
          </div>
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
                  {...methods.register('email', {
                    required: '필수 입력 항목이에요',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '유효한 이메일 주소를 입력해주세요.'
                    }
                  })}
                  className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:
                  body2-regular-16px ${
                    errors.email ? 'border-red' : focusedField === 'email' ? 'border-main-400' : 'border-gray-900'
                  }`}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={preventSpaceInput}
                />
                {email && focusedField === 'email' && (
                  <button
                    type="button"
                    onMouseDown={() => methods.setValue('email', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X />
                  </button>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 body2-regular-16px text-red flex items-center">
                  <RedX />
                  {errors.email.message}
                </p>
              )}
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
                  {...methods.register('password', {
                    required: '필수 입력 항목이에요',
                    validate: (value) => {
                      const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/;
                      if (!value) {
                        return '필수 입력 항목이에요';
                      } else if (!pattern.test(value)) {
                        return '영문/숫자/특수문자 혼합 (10자 이상)';
                      }
                      return true;
                    }
                  })}
                  className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:
                  body2-regular-16px ${
                    errors.password ? 'border-red' : focusedField === 'password' ? 'border-main-400' : 'border-gray-900'
                  }`}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => handleCapsLock(e)}
                  onKeyUp={(e) => handleCapsLock(e)}
                />
                {password && focusedField === 'password' && (
                  <button
                    type="button"
                    onMouseDown={() => methods.setValue('password', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X />
                  </button>
                )}
              </div>
              {isCapsLockOn && (
                <div className="ml-1 my-2 flex items-center">
                  <ReverseExclamation stroke="#423EDF" />
                  <span
                    className="ml-1 
body2-regular-16px text-main-400"
                  >
                    Caps Lock on
                  </span>
                </div>
              )}
              {!errors.password && (
                <p
                  className={`mt-1 body2-regular-16px flex items-center ${isPasswordValid ? 'text-main-400' : 'text-gray-600'}`}
                >
                  {isPasswordValid ? <CheckVector /> : <I />}
                  {isPasswordValid ? '영문/숫자/특수문자 혼합 (10자 이상)' : '영문/숫자/특수문자 혼합 (10자 이상)'}
                </p>
              )}
              {errors.password && (
                <>
                  <p className="mt-1 body2-regular-16px text-red flex items-center">
                    <RedX />
                    필수 입력 항목이에요
                  </p>
                  <p className="mt-1 body2-regular-16px text-red flex items:center">
                    <RedX />
                    영문/숫자/특수문자 혼합 (10자 이상)
                  </p>
                </>
              )}
            </div>

            <div className="mb-4 relative">
              <label
                className={`block subtitle2-bold-16px ${
                  errors.confirmPassword
                    ? 'text-red'
                    : focusedField === 'confirmPassword'
                      ? 'text-main-400'
                      : 'text-gray-900'
                }`}
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호를 한번 더 입력해 주세요"
                  {...methods.register('confirmPassword', {
                    required: '확인을 위해 비밀번호를 한 번 더 입력해 주세요',
                    validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.'
                  })}
                  className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:
                  body2-regular-16px ${
                    errors.confirmPassword
                      ? 'border-red'
                      : focusedField === 'confirmPassword'
                        ? 'border-main-400'
                        : 'border-gray-900'
                  }`}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={preventSpaceInput}
                />
                {confirmPassword && focusedField === 'confirmPassword' && (
                  <button
                    type="button"
                    onMouseDown={() => methods.setValue('confirmPassword', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X />
                  </button>
                )}
              </div>
              {!errors.confirmPassword && isConfirmPasswordValid && (
                <p className="mt-1 body2-regular-16px text-main-400 flex items-center">
                  <CheckVector />
                  비밀번호가 일치해요
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 body2-regular-16px text-red flex items:center">
                  <RedX />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mb-4 relative">
              <label
                className={`block 
                subtitle2-bold-16px ${
                  errors.nickname ? 'text-red' : focusedField === 'nickname' ? 'text-main-400' : 'text-gray-900'
                }`}
              >
                닉네임
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="닉네임을 입력해 주세요"
                  {...methods.register('nickname', {
                    required: '2~12자 이하만 가능해요',
                    minLength: {
                      value: 2,
                      message: '닉네임은 2자 이상이어야 합니다.'
                    },
                    maxLength: {
                      value: 12,
                      message: '닉네임은 12자 이하이어야 합니다.'
                    }
                  })}
                  className={`mt-2 block w-full p-4 border rounded-lg focus:outline-none placeholder:
                  body2-regular-16px ${
                    errors.nickname ? 'border-red' : focusedField === 'nickname' ? 'border-main-400' : 'border-gray-900'
                  }`}
                  onFocus={() => setFocusedField('nickname')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={preventSpaceInput}
                />
                {nickname && focusedField === 'nickname' && (
                  <button
                    type="button"
                    onMouseDown={() => methods.setValue('nickname', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X />
                  </button>
                )}
              </div>
              {!errors.nickname && (
                <p
                  className={`mt-1 body2-regular-16px flex items:center ${
                    isNicknameValidLocal ? 'text-main-400' : 'text-gray-900'
                  }`}
                >
                  {isNicknameValidLocal ? <CheckVector /> : <I />}
                  {isNicknameValidLocal ? '사용 가능한 닉네임이에요' : '2~12자 이하만 가능해요'}
                </p>
              )}
              {errors.nickname && (
                <p className="mt-1 body2-regular-16px text-red flex items:center">
                  <RedX />
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <CheckboxGroup showError={!!(errors.terms || errors.privacy)} />

            <div className="mt-6 mb-10 p-2 rounded flex items-center justify-center w-full">
              <div className="w-full flex justify-center">
                <div className=" ml-4">
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                      setRecaptchaToken(token);
                      clearErrors('recaptcha');
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {errors.recaptcha && (
              <p className="mt-1 body2-regular-16px text-red flex items:center">
                <RedI />
                {errors.recaptcha?.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full p-3 rounded-md subtitle1-bold-18px bg-main-400 text-white hover:bg-main-500"
            >
              가입하기
            </button>
          </form>
          <p className="mt-4 mb-64 text-center body2-regular-16px gap-12">
            이미 아이디가 있으신가요?
            <Link href="/login" className="body2-medium-16px underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </FormProvider>
  );
};

export default SignupForm;
