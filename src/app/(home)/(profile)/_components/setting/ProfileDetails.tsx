'use client';

import { filterSlang } from '@/utils/markdownCut';
import PasswordModal from './profilemodal/PasswordModal';
import NicknameModal from './profilemodal/NicknameModal';
import InfoModal from './profilemodal/InfoModal';
import { useState } from 'react';
import DetailItem from './DetailItem';
import OAuthLoginStatus from '@/app/(home)/(auth)/_components/OAuthLoginStatus';

type ProfileDetailsProps = {
  nickname: string;
  email?: string;
  info: string;
  onNicknameUpdate: (newNickname: string) => void;
  onInfoUpdate: (newInfo: string) => void;
};

const ProfileDetails = ({ nickname, email, info, onNicknameUpdate, onInfoUpdate }: ProfileDetailsProps) => {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [isNicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  return (
    <div className="w-[588px]">
      <DetailItem label="이메일" value={email} />
      <OAuthLoginStatus />
      <p className="border-b border-neutral-50 " />
      <DetailItem label="비밀번호" value="변경하기" onClick={() => setPasswordModalOpen(true)} />
      <DetailItem label="닉네임" value={nickname} onClick={() => setNicknameModalOpen(true)} />
      <DetailItem label="자기소개" value={filterSlang(info)} onClick={() => setInfoModalOpen(true)} />
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setNicknameModalOpen(false)}
        currentNickname={nickname}
        onNicknameUpdate={onNicknameUpdate}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        currentInfo={info}
        onInfoUpdate={onInfoUpdate}
      />
    </div>
  );
};

export default ProfileDetails;
