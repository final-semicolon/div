import ReverseExclamation from '@/assets/images/common/ReverseExclamation';
import { useEffect, useState } from 'react';

type CapsLockProps = {
  isFocused: boolean;
};

const CapsLock = ({ isFocused }: CapsLockProps) => {
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFocused) {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (isFocused) {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isFocused]);

  return (
    <>
      {isCapsLockOn && (
        <div className="ml-1 my-2 flex items-center">
          <span>
            <ReverseExclamation stroke="#423edf" />
          </span>
          <span className="ml-1 text-body2 font-regular text-main-400">Caps Lock on</span>
        </div>
      )}
    </>
  );
};

export default CapsLock;
