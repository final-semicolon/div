import { useState } from 'react';
import X from '@/assets/images/common/X';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Modal from '@/components/modal/Modal';
import { toast } from 'react-toastify';
import NewPassword from './NewPassword';
import CheckCurrentPassword from './CheckCurrentPassword';
import Chip from '@/components/common/Chip';
import { PASSWORD, MODAL_MESSAGES } from '@/constants/auth';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import MobileModal from '@/components/modal/MobileModal';

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
    console.log('확인용');
    if (validation) {
      const updateResponse = await fetch('/api/profile/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (updateResponse.ok) {
        toast.success(PASSWORD.SUCCESS);
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        toast.error(PASSWORD.FAILURE);
      }
    }
  };

  // 모달을 닫으려고 할 때 호출되는 함수
  const handleClose = () => {
    if (newPassword.length > 0 || validationMessage.length > 0) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  // 확인 모달에서 확인을 클릭했을 때 호출되는 함수
  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  // 확인 모달에서 취소를 클릭했을 때 호출되는 함수
  const handleCancelClose = () => setIsConfirmModalOpen(false);

  const validation = validationMessage === PASSWORD.CONFIRMED && newPassword === confirmPassword;

  return (
    <>
      <Mobile>
        <MobileModal isOpen={isOpen} onClose={handleClose}>
          <div className="w-screen h-screen p-5">
            <div className="flex justify-between">
              <div onClick={handleClose} className="mt-[5px] cursor-pointer">
                <X width={14} height={14} />
              </div>
              <h2 className="mb-10 text-subtitle2 font-bold text-center text-neutral-900">비밀번호 변경</h2>
              <div className="w-5 h-5"></div>
            </div>
            <div className="flex flex-col items-center">
              <div>
                <CheckCurrentPassword onValidationChange={setValidationMessage} />
                <NewPassword
                  newPassword={newPassword}
                  onNewPasswordChange={setNewPassword}
                  confirmPassword={confirmPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Chip
                type="button"
                intent={`${validation ? 'primary' : 'primary_disabled'}`}
                size={'large'}
                label="변경하기"
                onClick={handlePassword}
              />
            </div>
          </div>
        </MobileModal>
      </Mobile>
      <Default>
        <Modal isOpen={isOpen} onClose={handleClose} type="myPage">
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
              <Chip
                type="button"
                intent={`${validation ? 'primary' : 'primary_disabled'}`}
                size={'large'}
                label="변경하기"
                onClick={handlePassword}
              />
            </div>
          </div>
        </Modal>
      </Default>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={MODAL_MESSAGES}
      />
    </>
  );
};

export default PasswordModal;
