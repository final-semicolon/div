import { ChangeEventHandler, RefObject } from 'react';
import ProfileImage from '../ProfileImage';
import SettingsList from '../SettingsList';
import { UserData } from '@/context/auth.context';
import { User } from '@supabase/supabase-js';

type SettingDefaultFlowPorps = {
  profileImage: string;
  handleImageClick: () => void | undefined;
  handleImageUpload: ChangeEventHandler<HTMLInputElement>;
  inputRef: RefObject<HTMLInputElement>;
  nickname: string;
  me: User | null;
  info: string;
  updateProfile: (
    updates: Partial<{
      nickname: string;
      profile_image: string;
      info: string;
    }>
  ) => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => void;
};

const SettingDefaultFlow = ({
  profileImage,
  handleImageClick,
  handleImageUpload,
  inputRef,
  nickname,
  me,
  info,
  updateProfile,
  updateUserData
}: SettingDefaultFlowPorps) => {
  return (
    <div className="min-w-[608px] max-w-[748px]">
      <p className="text-h5 font-bold text-neutral-900 mb-2">프로필 관리</p>
      <p className="text-body1 font-regular text-neutral-600 mb-9">
        서비스에서 사용하는 내 계정 정보를 관리할 수 있습니다.
      </p>
      <div className="center-alignment p-[20px_80px] border border-neutral-50 rounded-3xl shadow-custom-light">
        <ProfileImage
          profileImage={profileImage}
          onImageClick={handleImageClick}
          onImageUpload={handleImageUpload}
          inputRef={inputRef}
        />
        <p className="text-neutral-900 text-h4 font-bold p-[24px_0_24px_0]">{nickname}님, 좋은 하루 보내세요!</p>
        <SettingsList
          nickname={nickname}
          email={me?.email}
          info={info}
          onNicknameUpdate={(newNickname) => {
            updateProfile({ nickname: newNickname });
            updateUserData({ nickname: newNickname });
          }}
          onInfoUpdate={(newInfo) => {
            updateProfile({ info: newInfo });
            updateUserData({ info: newInfo });
          }}
        />
      </div>
    </div>
  );
};

export default SettingDefaultFlow;
