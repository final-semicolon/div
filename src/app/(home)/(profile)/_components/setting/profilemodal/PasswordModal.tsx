import React, { useState } from 'react';
import X from '@/assets/images/common/X';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Modal from '@/components/modal/Modal';
import { toast } from 'react-toastify';
import NewPassword from './NewPassword';
import CheckCurrentPassword from './CheckCurrentPassword';
import Chip from '@/components/common/Chip';

type PasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PasswordModal = ({ isOpen, onClose }: PasswordModalProps) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const handlePassword = async () => {
    if (validationMessage === '기존 비밀번호가 확인되었습니다.') {
      const updateResponse = await fetch('/api/profile/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (updateResponse.ok) {
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
      } else {
        toast.error('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const handleNoPassword = () => {
    if (validationMessage !== '기존 비밀번호가 확인되었습니다.') {
      toast.error('기존 비밀번호를 확인해 주세요.');
    } else if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호를 확인해 주세요.');
    }
  };

  const handleClose = () => {
    if (newPassword.length > 0 || validationMessage.length > 0) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleCancelClose = () => setIsConfirmModalOpen(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="relative  w-[581px] h-[632px] p-[40px_80px]">
          <div className="flex justify-between">
            <h2 className="mb-10 text-h4 font-bold text-neutral-900">비밀번호 변경</h2>
            <div onClick={handleClose} className="mt-[5px] cursor-pointer">
              <X width={20} height={20} />
            </div>
          </div>
          <CheckCurrentPassword onValidationChange={setValidationMessage} />
          <NewPassword
            newPassword={newPassword}
            onNewPasswordChange={setNewPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />
          <div className="absolute bottom-[40px] right-[64px] flex justify-end gap-2 mt-4 px-4">
            {validationMessage === '현재 비밀번호가 확인되었습니다.' && newPassword === confirmPassword ? (
              <Chip type="button" intent={'primary'} size={'large'} label="변경하기" onClick={handlePassword} />
            ) : (
              <Chip
                type="button"
                intent={'primary_disabled'}
                size={'large'}
                label="변경하기"
                onClick={handleNoPassword}
              />
            )}
          </div>
        </div>
      </Modal>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={`작성을 중단할까요?`}
      />
    </>
  );
};

export default PasswordModal;
