import { NICKNAME } from '@/constants/auth';
import { isNicknameValid } from '@/utils/validateBannedWords';
import { useState, useEffect } from 'react';

type UseNicknameValidation = {
  nicknameValid: boolean;
  nicknameMessage: string;
  isCheckedNickname: boolean;
  nickname: string;
};

const useNicknameValidation = (nickname: string): UseNicknameValidation => {
  const [nicknameValid, setNicknameValid] = useState<boolean>(false);
  const [isCheckedNickname, setIsCheckedNickname] = useState<boolean>(false);
  const [nicknameMessage, setNicknameMessage] = useState<string>('');

  useEffect(() => {
    const handleValidateNickname = async (nickname: string) => {
      if (nickname.length > 12) {
        setNicknameMessage(NICKNAME.MISMATCH);
        return;
      }

      if (!isNicknameValid(nickname)) {
        setNicknameMessage(NICKNAME.MISMATCH);
        return;
      }

      try {
        const response = await fetch('/api/auth/check-nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nickname })
        });

        const result = await response.json();

        if (response.status === 409) {
          setNicknameMessage(NICKNAME.MISMATCH);
          setIsCheckedNickname(false);
          setNicknameValid(false);
        } else if (response.ok) {
          setNicknameMessage(NICKNAME.MATCH);
          setIsCheckedNickname(true);
          setNicknameValid(true);
        } else if (result.error) {
          // console.error('닉네임 확인 중 오류가 발생했습니다.:', result.error);
        }
      } catch (error) {
        // console.error('닉네임 확인 중 오류가 발생했습니다.:', error);
      }
    };

    if (nickname.length >= 2) {
      handleValidateNickname(nickname);
    } else {
      setNicknameValid(false);
      setIsCheckedNickname(false);
      setNicknameMessage(NICKNAME.RULE);
    }
  }, [nickname]);

  return {
    nickname,
    nicknameValid,
    nicknameMessage,
    isCheckedNickname
  };
};

export default useNicknameValidation;
