import { useEffect } from 'react';

export type MobileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: string;
};

const MobileModal = ({ isOpen, onClose, children }: MobileModalProps) => {
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
    <div className="fixed inset-0 center-alignment z-50" onClick={onClose}>
      <div className="bg-white relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default MobileModal;
