'use client';
import React, { useState, useEffect } from 'react';
import X from '@/assets/images/common/X';
import RedX from '@/assets/images/auth/RedX';
import CheckVector from '@/assets/images/auth/CheckVector';
import I from '@/assets/images/common/I';
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    setNicknameMessage('2~12자 이하만 가능해요');

    const handleValidateNickname = async (nickname: string) => {
      if (!isNicknameValid(nickname)) {
        setNicknameMessage('사용할 수 없는 닉네임입니다.');
        setIsCheckedNickname(false);
        setNicknameValid(false);
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
          setNicknameValid(false);
        }
      } catch (error) {
        setNicknameMessage('닉네임 확인 중 오류가 발생했어요.');
        setNicknameValid(false);
      }
    };

    if (hasInteracted && nickname.length >= 2) {
      handleValidateNickname(nickname);
    } else if (hasInteracted) {
      setNicknameValid(false);
      setIsCheckedNickname(false);
      setNicknameMessage('2~12자 이하만 가능해요');
    }
  }, [nickname, hasInteracted, setIsCheckedNickname, setNicknameMessage, setNicknameValid]);

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNickname('');
    setHasInteracted(false);
  };

  const getIcon = () => {
    if (!hasInteracted) return <I />;
    if (!nicknameValid) return <RedX />;
    if (nicknameValid) return <CheckVector />;
  };

  const borderColor = nicknameValid
    ? isFocused
      ? 'border-main-400'
      : 'border-gray-900'
    : hasInteracted && !nicknameValid
      ? 'border-red'
      : 'border-gray-900';
  const labelColor = nicknameValid
    ? isFocused
      ? 'text-main-400'
      : 'text-gray-900'
    : hasInteracted && !nicknameValid
      ? 'text-red'
      : 'text-gray-900';
  const messageColor = nicknameValid ? 'text-main-400' : 'text-red';

  return (
    <div className="relative mb-4">
      <label className={`block text-sm font-medium ${labelColor}`}>닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setHasInteracted(true);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="닉네임을 입력해 주세요."
        className={`mt-1 block w-full p-2 border rounded-md focus:outline-none ${borderColor}`}
      />
      {isFocused && nickname && (
        <button
          type="button"
          onMouseDown={handleClearInput}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-black z-10"
        >
          <X />
        </button>
      )}
      <div className="flex items-center mt-1 text-sm">
        {getIcon()}
        <p className={`ml-2 ${hasInteracted ? messageColor : 'text-gray-900'}`}>{nicknameMessage}</p>
      </div>
    </div>
  );
};

export default NicknameCheck;
