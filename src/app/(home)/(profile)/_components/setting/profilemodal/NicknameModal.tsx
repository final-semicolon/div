import { useState, ChangeEvent } from 'react';
import Modal from '@/components/modal/Modal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { isNicknameValid } from '@/utils/validateBannedWords';
import { MODAL_MESSAGES, NICKNAME } from '@/constants/auth';
import X from '@/assets/images/common/X';
import useDebounce from '@/hooks/common/useDebounce';
import useNicknameValidation from '@/hooks/common/useNicknameValidation';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import MobileModal from '@/components/modal/MobileModal';
import NicknameModalFlow from '../settingresponsive/NicknameModalFlow';

type NicknameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onNicknameUpdate: (newNickname: string) => void;
};

const NicknameModal = ({ isOpen, onClose, onNicknameUpdate }: NicknameModalProps) => {
  const [newNickname, setNewNickname] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const debouncedNickname = useDebounce(newNickname, 300);
  const { nicknameMessage } = useNicknameValidation(debouncedNickname);

  const onNicknameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // 띄어쓰기를 제거한 입력값을 설정
    const value = e.target.value.replace(/\s+/g, '');
    setNewNickname(value);
  };

  // 모달을 닫으려고 할 때 호출되는 함수
  const handleClose = () => {
    if (newNickname.length > 0) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  // 확인 모달에서 확인을 클릭했을 때 호출되는 함수
  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    setNewNickname('');
  };

  // 확인 모달에서 취소를 클릭했을 때 호출되는 함수
  const handleCancelClose = () => setIsConfirmModalOpen(false);

  const handleSave = () => {
    if (
      newNickname !== '' &&
      newNickname.length >= NICKNAME.MIN_LENGTH &&
      newNickname.length <= NICKNAME.MAX_LENGTH &&
      isNicknameValid(newNickname) &&
      nicknameMessage === NICKNAME.MATCH
    ) {
      onNicknameUpdate(newNickname);
      onClose();
    }
  };

  return (
    <>
      <Mobile>
        <MobileModal isOpen={isOpen} onClose={handleClose}>
          <div className="w-screen h-screen p-5 ">
            <div className="flex justify-between">
              <div onClick={handleClose} className="mt-[5px] cursor-pointer">
                <X width={14} height={14} />
              </div>
              <h2 className="mb-10 text-subtitle2 font-bold text-center text-neutral-900">닉네임 변경</h2>
              <div className="w-5 h-5"></div>
            </div>
            <NicknameModalFlow
              newNickname={newNickname}
              onNicknameHandler={onNicknameHandler}
              setNewNickname={setNewNickname}
              handleSave={handleSave}
              nicknameMessage={nicknameMessage}
            />
          </div>
        </MobileModal>
      </Mobile>
      <Default>
        <Modal isOpen={isOpen} onClose={handleClose} type="myPage">
          <div className="w-[581px] h-[398px] p-[40px_80px]">
            <div className="flex justify-between">
              <h2 className="mb-10 text-h4 font-bold text-neutral-900">닉네임 변경</h2>
              <div onClick={handleClose} className="mt-[5px] cursor-pointer">
                <X width={20} height={20} />
              </div>
            </div>
            <NicknameModalFlow
              newNickname={newNickname}
              onNicknameHandler={onNicknameHandler}
              setNewNickname={setNewNickname}
              handleSave={handleSave}
              nicknameMessage={nicknameMessage}
            />
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

export default NicknameModal;
