// 'use client';
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import SignupButton from './SignupButton';
// import CheckboxGroup from './CheckboxGroup';
// import { useRouter } from 'next/navigation';
// import PasswordFields from './PasswordFields';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useAuth } from '@/context/auth.context';
// import OAuthButtons from './OAuthButtons';
// import useOAuthLogin from '@/hooks/common/useOAuthLogin';
// import EmailCheck from './EmailCheck';
// import Logo from '@/assets/images/header/Logo';
// import NicknameCheck from './NicknameCheck ';
// import Link from 'next/link';

// const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

// const SignupForm = () => {
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   const [agreeAll, setAgreeAll] = useState<boolean>(false);
//   const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
//   const [agreePrivacy, setAgreePrivacy] = useState<boolean>(false);
//   const [email, setEmail] = useState<string>('');
//   const [nickname, setNickname] = useState<string>('');
//   const [emailValid, setEmailValid] = useState<boolean>(false);
//   const [passwordValid, setPasswordValid] = useState<boolean>(false);
//   const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(false);
//   const [nicknameValid, setNicknameValid] = useState<boolean>(false);
//   const [formValid, setFormValid] = useState<boolean>(false);
//   const [isCheckedNickname, setIsCheckedNickname] = useState<boolean>(false);
//   const [isCheckedEmail, setIsCheckedEmail] = useState<boolean>(false);

//   const [emailMessage, setEmailMessage] = useState<string>('');
//   const [passwordMessage, setPasswordMessage] = useState<string>('');
//   const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>('');
//   const [nicknameMessage, setNicknameMessage] = useState<string>('');

//   const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

//   const router = useRouter();
//   const { signUp } = useAuth();
//   const { handleOAuthLogin } = useOAuthLogin();

//   useEffect(() => {
//     const validatePassword = (password: string) => {
//       const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/;
//       return passwordRegex.test(password);
//     };

//     const validateNickname = (nickname: string) => {
//       return nickname.length >= 2 && nickname.length <= 12;
//     };

//     setPasswordValid(validatePassword(password));
//     setConfirmPasswordValid(password === confirmPassword);
//     const isValidNickname = validateNickname(nickname);
//     setNicknameValid(isValidNickname);

//     setPasswordMessage(
//       validatePassword(password) ? '영문/숫자/특수문자 혼합 (10자 이상)' : '영문/숫자/특수문자 혼합 (10자 이상)'
//     );

//     setConfirmPasswordMessage(password === confirmPassword ? '비밀번호가 일치해요.' : '비밀번호가 일치하지 않아요.');
//     setNicknameMessage(isValidNickname ? '사용 가능한 닉네임이에요.' : '2~12자 이하');
//   }, [password, confirmPassword, nickname]);

//   useEffect(() => {
//     setFormValid(
//       emailValid &&
//         passwordValid &&
//         confirmPasswordValid &&
//         nicknameValid &&
//         agreeTerms &&
//         agreePrivacy &&
//         isCheckedNickname &&
//         isCheckedEmail &&
//         recaptchaToken !== null
//     );
//   }, [
//     emailValid,
//     passwordValid,
//     confirmPasswordValid,
//     nicknameValid,
//     agreeTerms,
//     agreePrivacy,
//     isCheckedNickname,
//     isCheckedEmail,
//     recaptchaToken
//   ]);

//   const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!agreeTerms || !agreePrivacy) {
//       toast.error('약관 동의를 확인해주세요');
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error('비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     const result = await signUp(email, password, nickname, recaptchaToken);

//     if (result.status === 200) {
//       toast.success('회원가입이 완료되었습니다.', {
//         autoClose: 2000,
//         onClose: () => router.replace('/')
//       });
//     } else {
//       toast.error(result.message || '회원가입 중 오류가 발생했습니다.');
//     }
//   };

//   const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
//     event.preventDefault();
//     const form = event.currentTarget.closest('form') as HTMLFormElement;
//     form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
//   };

//   const onReCaptchaChange = (token: string | null) => {
//     setRecaptchaToken(token);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-full">
//       <div className="bg-white  w-full max-w-[420px]">
//         <div className="flex items-center justify-center mb-[120px]">
//           <Link href="/">
//             <Logo />
//           </Link>
//         </div>
//         <div className="border-b-2 mb-8">
//           <OAuthButtons handleLogin={handleOAuthLogin} title="SNS 계정으로 회원가입" />
//         </div>
//         <form onSubmit={handleSignup} className="mt-10">
//           <EmailCheck
//             email={email}
//             setEmail={setEmail}
//             emailValid={emailValid}
//             setEmailValid={setEmailValid}
//             setIsCheckedEmail={setIsCheckedEmail}
//             emailMessage={emailMessage}
//             setEmailMessage={setEmailMessage}
//           />
//           <PasswordFields
//             password={password}
//             setPassword={setPassword}
//             confirmPassword={confirmPassword}
//             setConfirmPassword={setConfirmPassword}
//             passwordValid={passwordValid}
//             confirmPasswordValid={confirmPasswordValid}
//             passwordMessage={passwordMessage}
//             confirmPasswordMessage={confirmPasswordMessage}
//           />
//           <NicknameCheck
//             nickname={nickname}
//             setNickname={setNickname}
//             nicknameValid={nicknameValid}
//             setNicknameValid={setNicknameValid}
//             setIsCheckedNickname={setIsCheckedNickname}
//             nicknameMessage={nicknameMessage}
//             setNicknameMessage={setNicknameMessage}
//           />
//           <CheckboxGroup
//             agreeAll={agreeAll}
//             setAgreeAll={setAgreeAll}
//             agreeTerms={agreeTerms}
//             setAgreeTerms={setAgreeTerms}
//             agreePrivacy={agreePrivacy}
//             setAgreePrivacy={setAgreePrivacy}
//           />
//           <div className="mb-2">
//             <div className="p-2 rounded flex items-center justify-center">
//               <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={onReCaptchaChange} />
//             </div>
//           </div>
//           <SignupButton onClick={handleButtonClick} />
//           <p className="mt-3 text-center body2-regular-16px">
//             이미 아이디가 있으신가요?
//             <Link href="/login" className="body2-medium-16px underline">
//               로그인
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;
'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import useOAuthLogin from '@/hooks/common/useOAuthLogin';
import OAuthButtons from './OAuthButtons';
import CheckboxGroup from './CheckboxGroup';
import NicknameCheck from './NicknameCheck ';
import Link from 'next/link';
import Logo from '@/assets/images/header/Logo';

type SignupFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  terms: boolean;
  privacy: boolean;
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormInputs>();
  const router = useRouter();
  const { signUp } = useAuth();
  const { handleOAuthLogin } = useOAuthLogin();
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null);

  // 닉네임 관련 상태 관리
  const [nickname, setNickname] = React.useState<string>('');
  const [nicknameValid, setNicknameValid] = React.useState<boolean>(false);
  const [isCheckedNickname, setIsCheckedNickname] = React.useState<boolean>(false);
  const [nicknameMessage, setNicknameMessage] = React.useState<string>('');

  const [agreeAll, setAgreeAll] = React.useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = React.useState<boolean>(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    if (!recaptchaToken) {
      return;
    }

    if (data.password !== data.confirmPassword) {
      return;
    }

    const result = await signUp(data.email, data.password, nickname, recaptchaToken);

    if (result.status === 200) {
      toast.success('회원가입이 완료되었어요!', {
        autoClose: 2000,
        onClose: () => router.replace('/')
      });
    } else {
      toast.error(result.message || '회원가입 중 오류가 발생했어요.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white  w-full max-w-[420px]">
        <div className="flex items-center justify-center mb-[120px]">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="text-center border-b-2 mb-8">
          <OAuthButtons title="SNS 계정으로 회원가입" handleLogin={handleOAuthLogin} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              {...register('email', {
                required: '필수 입력 항목이에요',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '유효한 이메일 주소를 입력해주세요.'
                }
              })}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none ${
                errors.email ? 'border-red' : 'border-gray-900'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              {...register('password', {
                required: '필수 입력 항목이에요',
                minLength: {
                  value: 10,
                  message: '비밀번호는 최소 10자 이상이어야 합니다.'
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{10,}$/,
                  message: '비밀번호는 영문/숫자/특수문자를 혼합해야 합니다.'
                }
              })}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none ${
                errors.password ? 'border-red' : 'border-gray-900'
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호를 한번 더 입력해 주세요"
              {...register('confirmPassword', {
                required: '확인을 위해 비밀번호를 한 번 더 입력해 주세요',
                validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.'
              })}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none ${
                errors.confirmPassword ? 'border-red' : 'border-gray-900'
              }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red">{errors.confirmPassword.message}</p>}
          </div>
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
          {errors.terms && <p className="mt-1 text-sm text-red">{errors.terms.message}</p>}
          {errors.privacy && <p className="mt-1 text-sm text-red">{errors.privacy.message}</p>}

          <div className="mb-4 p-2 rounded flex items-center justify-center ">
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />
          </div>

          <button type="submit" className="w-full p-3 rounded-md subtitle1-bold-18px bg-main-400 text-white">
            가입하기
          </button>
        </form>
        <p className="mt-3 text-center body2-regular-16px">
          이미 아이디가 있으신가요?
          <Link href="/login" className="body2-medium-16px underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
