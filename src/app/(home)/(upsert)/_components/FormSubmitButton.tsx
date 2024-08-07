import Chip from '@/components/common/Chip';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { POST_CANCLE_TEXT, POST_APPROVE_TEXT } from '@/constants/upsert';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';

type FormSubmitButtonProps = { content: string; handleSubmit: () => Promise<void> };

const FormSubmitButton = ({ content, handleSubmit }: FormSubmitButtonProps) => {
  const router = useRouter();
  const approveButton = useRef<HTMLButtonElement>(null);
  const [isCancleConfirmOpen, setIsCancleConfirmOpen] = useState<boolean>(false);
  const [isPostConfirmOpen, setIsPostConfirmOpen] = useState<boolean>(false);
  const [confirmText, setConfirmText] = useState<string>('');

  const handleCancleConfirmClick: MouseEventHandler = () => {
    setConfirmText(POST_CANCLE_TEXT);
    setIsCancleConfirmOpen(true);
  };

  const handlePostConfirmClick: MouseEventHandler = (event) => {
    event.preventDefault();
    setConfirmText(POST_APPROVE_TEXT);
    setIsPostConfirmOpen(true);
  };

  const approveCancleConfirm = (): void => {
    router.back();
  };

  const closeCancleConfirm = (): void => {
    setIsCancleConfirmOpen(false);
  };

  const approvePostConfirm = async (): Promise<void> => {
    setIsCancleConfirmOpen(false);
    await handleSubmit();
  };

  const closePostConfirmClose = (): void => {
    setIsPostConfirmOpen(false);
  };

  return (
    <div className="flex gap-5 justify-end">
      <ConfirmModal
        isOpen={isCancleConfirmOpen}
        message={confirmText}
        onConfirm={approveCancleConfirm}
        onClose={closeCancleConfirm}
      />
      <Chip type="button" intent={'gray'} size={'large'} label="취소" onClick={handleCancleConfirmClick} />
      <ConfirmModal
        isOpen={isPostConfirmOpen}
        message={confirmText}
        onConfirm={approvePostConfirm}
        onClose={closePostConfirmClose}
      />
      {content.length === 0 ? (
        <Chip type="button" intent={'primary_disabled'} size="large" label="등록" />
      ) : (
        <Chip type="button" intent={'primary'} size="large" label="등록" onClick={handlePostConfirmClick} />
      )}
      <button ref={approveButton}></button>
    </div>
  );
};

export default FormSubmitButton;
