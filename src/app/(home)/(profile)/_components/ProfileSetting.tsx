'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth.context';
import { uploadImage, upDateImage } from '@/utils/imageUpload';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileImage from './setting/ProfileImage';
import ProfileDetails from './setting/ProfileDetails';

const ProfileSetting = () => {
  const { userData, me, updateUserData } = useAuth();
  const [profileImage, setProfileImage] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const newProfileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || '');
      setProfileImage(userData.profile_image || '');
      setInfo(userData.info || '');
    }
  }, [userData]);

  const handleImageClick = () => inputRef.current?.click();

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !me?.id) return;

    newProfileRef.current = file;
    const userId = me.id;
    const defaultProfileImage =
      'https://jtorewqfshytdtgldztv.supabase.co/storage/v1/object/public/profile_images/default_profile_image.png';
    const oldPath = profileImage.split('/').slice(-1)[0];
    const filePath = `${userId}_${Date.now()}.png`;

    try {
      const publicUrl =
        profileImage === defaultProfileImage
          ? await uploadImage(file, filePath)
          : await upDateImage(file, filePath, oldPath);

      if (publicUrl) {
        await updateProfile({ profile_image: publicUrl });
        setProfileImage(publicUrl);
        updateUserData({ profile_image: publicUrl });
      } else {
        toast.error('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', (error as Error).message);
    }
  };

  const updateProfile = async (updates: Partial<{ nickname: string; profile_image: string; info: string }>) => {
    if (!me) return;

    try {
      const response = await fetch('/api/profile/profileauth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: me.id, ...updates })
      });

      if (response.ok) {
        toast.success('프로필이 성공적으로 수정되었습니다.');
      } else {
        toast.error('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', (error as Error).message);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
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
        <ProfileDetails
          nickname={nickname}
          email={me?.email}
          info={info}
          onNicknameUpdate={(newNickname) => {
            setNickname(newNickname);
            updateProfile({ nickname: newNickname });
            updateUserData({ nickname: newNickname });
          }}
          onInfoUpdate={(newInfo) => {
            setInfo(newInfo);
            updateProfile({ info: newInfo });
            updateUserData({ info: newInfo });
          }}
        />
      </div>
    </div>
  );
};

export default ProfileSetting;
