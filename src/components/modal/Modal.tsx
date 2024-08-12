import { useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: string;
};

const Modal = ({ isOpen, onClose, children, type }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 center-alignment bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className={`bg-white ${type === 'myPage' ? 'rounded-[32px]' : 'rounded-2xl'} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
