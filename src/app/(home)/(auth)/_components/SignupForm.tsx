'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupButton from './SignupButton';
import CheckboxGroup from './CheckboxGroup';
import { useRouter } from 'next/navigation';
import PasswordFields from './PasswordFields';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '@/context/auth.context';
import OAuthButtons from './OAuthButtons';
import useOAuthLogin from '@/hooks/common/useOAuthLogin';
import EmailCheck from './EmailCheck';
import Logo from '@/assets/images/header/Logo';
import NicknameCheck from './NicknameCheck ';
import Link from 'next/link';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const SignupForm = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeAll, setAgreeAll] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(false);
  const [nicknameValid, setNicknameValid] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [isCheckedNickname, setIsCheckedNickname] = useState<boolean>(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState<boolean>(false);

  const [emailMessage, setEmailMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const router = useRouter();
  const { signUp } = useAuth();
  const { handleOAuthLogin } = useOAuthLogin();

  useEffect(() => {
    const validatePassword = (password: string) => {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/;
      return passwordRegex.test(password);
    };

    const validateNickname = (nickname: string) => {
      return nickname.length >= 2 && nickname.length <= 12;
    };

    setPasswordValid(validatePassword(password));
    setConfirmPasswordValid(password === confirmPassword);
    const isValidNickname = validateNickname(nickname);
    setNicknameValid(isValidNickname);

    // setPasswordMessage(
    //   validatePassword(password) ? '사용 가능한 비밀번호에요.' : '영문/숫자/특수문자 혼합 (10자 이상).'
    // );
    setConfirmPasswordMessage(
      password === confirmPassword ? '영문/숫자/특수문자 혼합 (10자 이상)' : '영문/숫자/특수문자 혼합 (10자 이상)'
    );
    setNicknameMessage(isValidNickname ? '사용 가능한 닉네임이에요.' : '2~12자 이하');
  }, [password, confirmPassword, nickname]);

  useEffect(() => {
    setFormValid(
      emailValid &&
        passwordValid &&
        confirmPasswordValid &&
        nicknameValid &&
        agreeTerms &&
        agreePrivacy &&
        isCheckedNickname &&
        isCheckedEmail &&
        recaptchaToken !== null
    );
  }, [
    emailValid,
    passwordValid,
    confirmPasswordValid,
    nicknameValid,
    agreeTerms,
    agreePrivacy,
    isCheckedNickname,
    isCheckedEmail,
    recaptchaToken
  ]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreeTerms || !agreePrivacy) {
      toast.error('약관 동의를 확인해주세요');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await signUp(email, password, nickname, recaptchaToken);

    if (result.status === 200) {
      toast.success('회원가입이 완료되었습니다.', {
        autoClose: 2000,
        onClose: () => router.replace('/')
      });
    } else {
      toast.error(result.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget.closest('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const onReCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>
        <div className="border-b-2 mb-8">
          <OAuthButtons handleLogin={handleOAuthLogin} />
        </div>
        <form onSubmit={handleSignup} className="mt-3">
          <EmailCheck
            email={email}
            setEmail={setEmail}
            emailValid={emailValid}
            setEmailValid={setEmailValid}
            setIsCheckedEmail={setIsCheckedEmail}
            emailMessage={emailMessage}
            setEmailMessage={setEmailMessage}
          />
          <PasswordFields
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordValid={passwordValid}
            confirmPasswordValid={confirmPasswordValid}
            passwordMessage={passwordMessage}
            confirmPasswordMessage={confirmPasswordMessage}
          />
          <NicknameCheck
            nickname={nickname}
            setNickname={setNickname}
            nicknameValid={nicknameValid}
            setNicknameValid={setNicknameValid}
            setIsCheckedNickname={setIsCheckedNickname}
            nicknameMessage={nicknameMessage}
            setNicknameMessage={setNicknameMessage}
          />
          <CheckboxGroup
            agreeAll={agreeAll}
            setAgreeAll={setAgreeAll}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            agreePrivacy={agreePrivacy}
            setAgreePrivacy={setAgreePrivacy}
          />
          <div className="mb-2">
            <div className="p-2 rounded flex items-center justify-center">
              <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={onReCaptchaChange} />
            </div>
          </div>
          <SignupButton onClick={handleButtonClick} disabled={!formValid} />
          <p className="mt-3 text-center body2-regular-16px">
            이미 아이디가 있으신가요?
            <Link href="/login" className="body2-medium-16px underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
