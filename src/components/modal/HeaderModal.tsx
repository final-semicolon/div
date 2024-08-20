'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import useProfiletopTabStore from '@/store/useProfiletopTabStore';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HeaderModal = ({ isOpen, onClose }: ModalProps) => {
  const [animate, setAnimate] = useState('');
  const [visible, setVisible] = useState(isOpen);
  const { isLoggedIn, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const setTopButtonTab = useProfiletopTabStore((state) => state.setTopButtonTab);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimate('animate-slide-down-from-top');
      document.body.style.overflow = 'hidden';
    } else if (animate !== '') {
      setAnimate('animate-slide-up-to-top');
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, animate, onClose]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setVisible(false);
      document.body.style.overflow = 'auto';
    }
  };

  if (!visible) return null;

  const handleLogout = async () => {
    const result = await logOut();
    if (result.status === 200) {
      router.push('/');
    } else {
      toast.error(result.message || '로그아웃에 실패했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-start justify-center w-full"
      style={{ top: '68px' }}
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`bg-white h-full ${animate}`} style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="w-full p-5 min-w-[375px] max-w-[767px]">
          {!isLoggedIn && (
            <div className="w-full items-center grid grid-cols-2 gap-4 h-[83px] border-b box-border">
              <button
                className="w-full h-[35px] border border-main-400 rounded text-subtitle3 font-bold text-primary-400"
                onClick={() => {
                  router.push('/login');
                  onClose();
                }}
              >
                로그인
              </button>
              <button
                className="w-full h-[35px] rounded bg-main-400 text-subtitle3 font-bold text-white"
                onClick={() => {
                  router.push('/signup');
                  onClose();
                }}
              >
                회원가입
              </button>
            </div>
          )}
          <div className="w-full">
            <div
              className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full"
              onClick={() => {
                router.push('/');
                onClose();
              }}
            >
              메인
            </div>
            <div
              className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full"
              onClick={() => {
                router.push('/forum');
                onClose();
              }}
            >
              포럼
            </div>
            <div
              className="ml-5 mt-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full"
              onClick={() => {
                router.push('/qna');
                onClose();
              }}
            >
              Q&A
            </div>
            <div
              className="ml-5 my-5 border-0 text-subtitle2 font-bold text-neutral-900 w-full"
              onClick={() => {
                router.push('/archive');
                onClose();
              }}
            >
              라이브러리
            </div>
          </div>
          {isLoggedIn && (
            <div className="border-t w-full">
              <div
                className="ml-5 mt-5 border-0 text-subtitle2 font-medium text-neutral-900 w-full"
                onClick={() => {
                  setTopButtonTab('profile');
                  router.push('/profile');
                  onClose();
                }}
              >
                마이페이지
              </div>
              <div
                className="ml-5 mt-5 border-0 text-subtitle2 font-medium text-neutral-500 cursor-pointer w-full"
                onClick={async () => {
                  onClose();
                  await handleLogout();
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
