import { useEffect, useState } from 'react';

const useCapsLock = (isFocused: boolean) => {
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

  return isCapsLockOn;
};

export default useCapsLock;
