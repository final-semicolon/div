import { useState, useEffect, ChangeEvent } from 'react';
import Modal from '@/components/modal/Modal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { toast } from 'react-toastify';
import { isNicknameValid } from '@/utils/validateBannedWords';
import { MODAL_MESSAGES, NICKNAME } from '@/constants/auth';
import { getStyles } from '@/utils/profileStyles';
import Chip from '@/components/common/Chip';
import X from '@/assets/images/common/X';
import Check from '@/assets/images/common/Check';
import useDebounce from '@/hooks/common/useDebounce';
import useNicknameValidation from '@/hooks/common/useNicknameValidation';

type NicknameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onNicknameUpdate: (newNickname: string) => void;
};

const NicknameModal = ({ isOpen, onClose, currentNickname, onNicknameUpdate }: NicknameModalProps) => {
  const [newNickname, setNewNickname] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debouncedNickname = useDebounce(newNickname, 300);
  const { nicknameMessage } = useNicknameValidation(debouncedNickname);

  const onNicknameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // 띄어쓰기를 제거한 입력값을 설정
    const value = e.target.value.replace(/\s+/g, '');
    setNewNickname(value);
  };

  // 모달을 닫으려고 할 때 호출되는 함수
  const handleClose = () => {
    if (newNickname !== currentNickname) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  // 확인 모달에서 확인을 클릭했을 때 호출되는 함수
  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    setNewNickname(currentNickname);
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

  const { titleTextColor, conditionTextColor, stroke, borderColor } = getStyles({
    isConditionsNotMetOnBlur: !isFocused && newNickname.length >= NICKNAME.MAX_LENGTH,
    isConditionsMetOnBlur:
      !isFocused && newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH,
    isConditionsNotMetOnFocus: newNickname.length >= NICKNAME.MAX_LENGTH || nicknameMessage === NICKNAME.MISMATCH,
    isConditionsMetOnFocus: newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH
  });

  const getText = () => {
    if (newNickname.length >= NICKNAME.MAX_LENGTH || nicknameMessage === NICKNAME.MISMATCH) {
      return nicknameMessage;
    }
    if (newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH) {
      return nicknameMessage;
    }
    return NICKNAME.RULE;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} type="myPage">
        <div className="w-[581px] h-[398px] p-[40px_80px]">
          <div className="flex justify-between">
            <h2 className="mb-10 text-h4 font-bold text-neutral-900">닉네임 변경</h2>
            <div onClick={handleClose} className="mt-[5px] cursor-pointer">
              <X width={20} height={20} />
            </div>
          </div>
          <h2 className={`mb-2 ${titleTextColor}`}>새로운 닉네임</h2>
          <div className={`relative block w-[421px] h-[56px] p-[16px] border rounded ${borderColor}`}>
            <input
              type="text"
              value={newNickname}
              onChange={onNicknameHandler}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-[353px] outline-transparent"
              placeholder={NICKNAME.NICKNAME_EDIT_PLACEHOLDER}
            />
            {newNickname && (
              <button
                type="button"
                onClick={() => setNewNickname('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <X />
              </button>
            )}
          </div>
          <div className="mb-[72px] flex items-center mt-2">
            <Check stroke={stroke} />
            <span className={` ${conditionTextColor}`}>{getText()}</span>
          </div>
          <div className="flex justify-end mt-4">
            <Chip
              type="button"
              intent={newNickname.length > 1 && newNickname.length <= 12 ? 'primary' : 'primary_disabled'}
              size={'large'}
              label="변경하기"
              onClick={handleSave}
            />
          </div>
        </div>
      </Modal>
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
