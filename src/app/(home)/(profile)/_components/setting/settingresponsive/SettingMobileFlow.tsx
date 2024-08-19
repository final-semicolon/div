import { ChangeEventHandler, RefObject } from 'react';
import ProfileImage from '../ProfileImage';
import SettingsList from '../SettingsList';
import { UserData } from '@/context/auth.context';
import { User } from '@supabase/supabase-js';

type SettingMobileFlowPorps = {
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

const SettingMobileFlow = ({
  profileImage,
  handleImageClick,
  handleImageUpload,
  inputRef,
  nickname,
  me,
  info,
  updateProfile,
  updateUserData
}: SettingMobileFlowPorps) => {
  return (
    <div className="min-w-[375px] max-w-[767px]">
      <div className="center-alignment p-5">
        <div className="mb-5">
          <ProfileImage
            profileImage={profileImage}
            onImageClick={handleImageClick}
            onImageUpload={handleImageUpload}
            inputRef={inputRef}
          />
        </div>
        <div className="center-alignment mb-6">
          <p className="text-neutral-900 text-subtitle1 font-bold mb-2">
            {nickname}
            <span className="text-neutral-800 text-subtitle1 font-medium"> 님 </span>
          </p>
          <p className="text-neutral-800 text-subtitle1 font-medium">좋은 하루 보내세요!</p>
        </div>
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

export default SettingMobileFlow;
