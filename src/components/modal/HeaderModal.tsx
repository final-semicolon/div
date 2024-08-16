'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderModal = ({ isOpen, onClose }: ModalProps) => {
  const [animate, setAnimate] = useState('');
  const { isLoggedIn, logOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setAnimate('animate-slide-down-from-top');
      document.body.style.overflow = 'hidden';
    } else if (animate !== '') {
      setAnimate('animate-slide-up-to-top');
      setTimeout(() => {
        onClose();
      }, 300);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const result = await logOut();
    if (result.status === 200) {
      window.location.href = '/';
    } else {
      toast.error(result.message || '로그아웃에 실패했습니다.');
    }
  };

  if (!isOpen && animate === '') return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-start justify-center w-full"
      style={{ top: '68px' }}
      onClick={onClose}
    >
      <div className={`bg-white h-full ${animate}`} style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="w-full p-5 min-w-[375px] max-w-[767px]">
          {!isLoggedIn && (
            <div className="w-full items-center grid grid-cols-2 gap-4 h-[83px] border-b box-border">
              <Link href={'/login'}>
                <button
                  className="w-full h-[35px] border border-main-400 rounded text-subtitle3 font-bold text-primary-400"
                  onClick={onClose}
                >
                  로그인
                </button>
              </Link>
              <Link href={'/signup'}>
                <button
                  className="w-full h-[35px] rounded bg-main-400 text-subtitle3 font-bold text-white"
                  onClick={onClose}
                >
                  회원가입
                </button>
              </Link>
            </div>
          )}
          <div className="w-full">
            <Link href={'/'}>
              <div className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full" onClick={onClose}>
                메인
              </div>
            </Link>
            <Link href={'/forum'}>
              <div className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full" onClick={onClose}>
                포럼
              </div>
            </Link>
            <Link href={'/qna'}>
              <div className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full" onClick={onClose}>
                Q&A
              </div>
            </Link>
            <Link href={'/archive'}>
              <div className="ml-5 my-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full" onClick={onClose}>
                라이브러리
              </div>
            </Link>
          </div>
          {isLoggedIn && (
            <div className="border-t w-full">
              <Link href={'/profile'}>
                <div
                  className="ml-5 mt-5 border-0 text-subtitle2 font-medium text-neutral-900 w-full"
                  onClick={onClose}
                >
                  마이페이지
                </div>
              </Link>
              <div
                className="ml-5 mt-5 border-0 text-subtitle2 font-medium text-neutral-500 cursor-pointer w-full"
                onClick={async () => {
                  await handleLogout();
                  onClose();
                }}
              >
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderModal;
