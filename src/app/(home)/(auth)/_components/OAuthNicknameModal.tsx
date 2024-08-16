'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Vector from '@/assets/images/auth/Vector';
import CheckVector from '@/assets/images/auth/CheckVector';
import RedX from '@/assets/images/auth/RedX';
import { isNicknameValid } from '@/utils/validateBannedWords';

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-[32px] w-[500px]">{children}</div>
    </div>,
    document.body
  );
};

type NicknameModalProps = {
  isOpen: boolean;
  currentNickname: string;
  onNicknameUpdate: (newNickname: string) => void;
  userId: string;
};

const OAuthNicknameModal = ({ isOpen, currentNickname, onNicknameUpdate, userId }: NicknameModalProps) => {
  const [nickname, setNickname] = useState<string>(currentNickname || '');
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isCheckedNickname, setIsCheckedNickname] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setNickname(currentNickname || '');
  }, [currentNickname]);

  useEffect(() => {
    const handleValidateNickname = async (nickname: string) => {
      if (!nickname) {
        setNicknameValid(null);
        setIsCheckedNickname(false);
        setNicknameMessage('닉네임을 입력해 주세요');
        return;
      }

      if (nickname.length < 2) {
        setNicknameValid(false);
        setIsCheckedNickname(false);
        setNicknameMessage('2자~12자 이하');
        return;
      }
      if (!isNicknameValid(nickname)) {
        setNicknameMessage('사용할 수 없는 닉네임이에요');
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
          setNicknameValid(false);
          setIsCheckedNickname(false);
          setNicknameMessage('2자~12자 이하(혹은 사용이 불가능한 닉네임이에요)');
        } else if (response.ok) {
          setNicknameValid(true);
          setIsCheckedNickname(true);
          setNicknameMessage('사용 가능한 닉네임이에요');
        } else {
          setNicknameValid(false);
          setIsCheckedNickname(false);
          setNicknameMessage(result.error || '닉네임 확인 중 오류가 발생했어요');
        }
      } catch (error) {
        setNicknameValid(false);
        setIsCheckedNickname(false);
        setNicknameMessage('닉네임 확인 중 오류가 발생했어요');
      }
    };

    handleValidateNickname(nickname);
  }, [nickname]);

  const handleSubmit = async () => {
    if (isCheckedNickname) {
      try {
        const response = await fetch('/api/auth/update-nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, newNickname: nickname })
        });

        const result = await response.json();

        if (response.ok) {
          onNicknameUpdate(nickname);
        } else {
          setNicknameMessage(result.error || '닉네임 업데이트 중 오류가 발생했어요.');
        }
      } catch (error) {
        setNicknameMessage('닉네임 업데이트 중 오류가 발생했어요.');
      }
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setNickname(value);
  };

  const renderValidationMessage = () => {
    let IconComponent = <Vector />;
    let messageColor = 'text-gray-900';

    if (nicknameValid === true) {
      IconComponent = <CheckVector />;
      messageColor = 'text-main-400';
    } else if (nicknameValid === false) {
      IconComponent = <RedX />;
      messageColor = 'text-red';
    }

    return (
      <div className="flex items-center mt-2">
        <span>{IconComponent}</span>
        <p className={`ml-2 ${messageColor} body2-regular-16px`}>{nicknameMessage}</p>
      </div>
    );
  };

  const getBorderColor = () => {
    if (nicknameValid === false) return 'border-red';
    if (nicknameValid === true && isFocused) return 'border-main-400';
    if (isFocused) return 'border-main-400';
    return 'border-neutral-100';
  };

  const getTitleColor = () => {
    if (nicknameValid === false) return 'text-red';
    if (nicknameValid === true) return 'text-main-400';
    return 'text-neutral-900';
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-[581px] h-[398px] p-[40px]">
        <h2 className="mb-10 pl-4 text-h4 font-bold text-neutral-900">닉네임 설정</h2>
        <h2 className={`pl-2 mb-1 subtitle2-bold-16px ${getTitleColor()}`}>새로운 닉네임</h2>

        <input
          type="text"
          value={nickname}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleNicknameChange}
          className={`block w-[353px] outline-transparent border-2 rounded-md px-2 py-1 mb-4 ${getBorderColor()}`}
          placeholder="변경할 닉네임을 입력하세요."
        />
        {renderValidationMessage()}

        <div className="flex justify-end mt-4 px-4 mr-24">
          <button
            onClick={handleSubmit}
            disabled={!isCheckedNickname}
            className="border bg-main-400 text-white py-4 px-6 hover:bg-main-500 rounded disabled:bg-main-100"
          >
            설정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OAuthNicknameModal;
