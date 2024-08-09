'use client';
import React, { useEffect } from 'react';
import InputField from './InputField';
import { isNicknameValid } from '@/utils/validateBannedWords';

type NicknameCheckProps = {
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  nicknameValid: boolean;
  setNicknameValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCheckedNickname: React.Dispatch<React.SetStateAction<boolean>>;
  nicknameMessage: string;
  setNicknameMessage: React.Dispatch<React.SetStateAction<string>>;
};

const NicknameCheck = ({
  nickname,
  setNickname,
  nicknameValid,
  setNicknameValid,
  setIsCheckedNickname,
  nicknameMessage,
  setNicknameMessage
}: NicknameCheckProps) => {
  useEffect(() => {
    const handleValidateNickname = async (nickname: string) => {
      if (!isNicknameValid(nickname)) {
        setNicknameMessage('사용할 수 없는 닉네임입니다.');
        setIsCheckedNickname(false);
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
          setNicknameMessage('이미 사용중인 닉네임이에요.');
          setIsCheckedNickname(false);
          setNicknameValid(false);
        } else if (response.ok) {
          setNicknameMessage('사용 가능한 닉네임이에요.');
          setIsCheckedNickname(true);
          setNicknameValid(true);
        } else {
          setNicknameMessage(result.error || '닉네임 확인 중 오류가 발생했어요.');
        }
      } catch (error) {
        setNicknameMessage('닉네임 확인 중 오류가 발생했어요.');
      }
    };

    if (nickname.length >= 2) {
      handleValidateNickname(nickname);
    } else {
      setNicknameValid(false);
      setIsCheckedNickname(false);
      setNicknameMessage('닉네임은 2자 이상 12자 이하로 작성해주세요.');
    }
  }, [nickname, setIsCheckedNickname, setNicknameMessage, setNicknameValid]);

  return (
    <div className="mb-3 flex items-center">
      <div className="flex-grow">
        <InputField
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (2~12자)를 입력해 주세요."
          valid={nicknameValid}
          message={nicknameMessage}
          label="닉네임"
        />
      </div>
    </div>
  );
};

export default NicknameCheck;
