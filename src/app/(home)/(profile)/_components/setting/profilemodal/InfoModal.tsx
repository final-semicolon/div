import Modal from '@/components/modal/Modal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useState, useEffect, ChangeEvent } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import X from '@/assets/images/common/X';
import { toast } from 'react-toastify';
import { INFO, MODAL_MESSAGES } from '@/constants/auth';
import InfoModalFlow from '../settingresponsive/InfoModalFlow';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import MobileModal from '@/components/modal/MobileModal';

type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentInfo: string;
  onInfoUpdate: (newInfo: string) => void;
};

const InfoModal = ({ isOpen, onClose, currentInfo, onInfoUpdate }: InfoModalProps) => {
  const [newInfo, setNewInfo] = useState(currentInfo);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (newInfo === currentInfo) {
      setNewInfo(currentInfo);
    } else {
      if (newInfo.length > INFO.MAX_LENGTH) {
        setValidationMessage(INFO.MISMATCH);
      } else if (newInfo.length > 0) {
        setValidationMessage(`${newInfo.length}`);
      } else {
        setValidationMessage(INFO.RULE);
      }
    }
  }, [currentInfo, newInfo]);

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = () => {
    if (currentInfo !== newInfo && newInfo.length > 0 && newInfo.length <= INFO.MAX_LENGTH) {
      onInfoUpdate(newInfo);
      onClose();
    } else {
      toast.error(INFO.FAILURE);
    }
  };

  // 텍스트의 줄 수를 계산하는 함수
  const countLines = (text: string): number => text.split('\n').length;

  // textarea의 입력이 변경될 때 호출되는 함수
  const onInputHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = countLines(value);

    if (lines <= INFO.MAX_LINES) {
      setNewInfo(value);
    }
  };

  // 모달을 닫으려고 할 때 호출되는 함수
  const handleClose = () => {
    if (newInfo !== currentInfo) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  // 확인 모달에서 확인을 클릭했을 때 호출되는 함수
  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    setNewInfo(currentInfo);
  };

  // 확인 모달에서 취소를 클릭했을 때 호출되는 함수
  const handleCancelClose = () => setIsConfirmModalOpen(false);

  return (
    <>
      <Mobile>
        <MobileModal isOpen={isOpen} onClose={handleClose}>
          <div className="w-screen h-screen p-5">
            <div className="flex justify-between">
              <div onClick={handleClose} className="mt-[5px] cursor-pointer">
                <X width={14} height={14} />
              </div>
              <h2 className="mb-10 text-subtitle2 font-bold text-center text-neutral-900">자기소개</h2>
              <div className="w-5 h-5"></div>
            </div>
            <InfoModalFlow
              newInfo={newInfo}
              currentInfo={currentInfo}
              onInputHandler={onInputHandler}
              validationMessage={validationMessage}
              handleSave={handleSave}
            />
          </div>
        </MobileModal>
      </Mobile>
      <Default>
        <Modal isOpen={isOpen} onClose={handleClose} type="myPage">
          <div className="w-[581px] h-[477px] p-[40px_80px]">
            <div className="flex flex-row justify-between mb-10">
              <h2 className="text-h4 font-bold  text-neutral-900">자기소개</h2>
              <div onClick={handleClose} className=" cursor-pointer">
                <X width={20} height={20} />
              </div>
            </div>
            <InfoModalFlow
              newInfo={newInfo}
              currentInfo={currentInfo}
              onInputHandler={onInputHandler}
              validationMessage={validationMessage}
              handleSave={handleSave}
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

export default InfoModal;
