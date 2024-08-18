'use client';

import ConfirmModal from '@/components/modal/ConfirmModal';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteAccountButton = () => {
  const { deleteUser } = useAuth();
  const router = useRouter();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSecondConfirmModalOpen, setIsSecondConfirmModalOpen] = useState(false);

  const handleDeleteUser = async () => {
    const { status, message } = await deleteUser();
    if (status === 200) {
      toast.success(message);
      router.push('/');
    } else {
      toast.error(message);
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    setIsSecondConfirmModalOpen(true);
  };

  const handleCancelClose = () => setIsConfirmModalOpen(false);

  const handleSecondConfirmClose = () => {
    setIsSecondConfirmModalOpen(false);
    handleDeleteUser();
  };

  const handleSecondCancelClose = () => setIsSecondConfirmModalOpen(false);

  return (
    <>
      <button
        onClick={() => setIsConfirmModalOpen(true)}
        className="text-neutral-600 text-body4 p-[24px_20px] md:text-subtitle1 font-regular md:font-medium hover:underline decoration-2 "
      >
        회원탈퇴
      </button>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={'탈퇴시 일부 서비스 이용이 어려워요 \n 회원탈퇴를 진행 할까요?'}
      />
      <ConfirmModal
        isOpen={isSecondConfirmModalOpen}
        onClose={handleSecondCancelClose}
        onConfirm={handleSecondConfirmClose}
        message={'더 나은 서비스로 찾아뵙겠습니다. \n 이용해 주셔서 감사합니다'}
      />
    </>
  );
};

export default DeleteAccountButton;
