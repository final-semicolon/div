'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth.context';
import { uploadImage, upDateImage } from '@/utils/imageUpload';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import SettingDefaultFlow from './setting/settingresponsive/SettingDefaultFlow';
import SettingMobileFlow from './setting/settingresponsive/SettingMobileFlow';
import SettingSkeletonUi from './setting/settingskeleton/SettingSkeletonUi';

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
      // console.error('이미지 업로드 실패:', error);
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
        if (updates.nickname && updates.nickname !== nickname) {
          toast.success('닉네임이 변경되었습니다.');
          setNickname(updates.nickname);
        }

        if (updates.info && updates.info !== info) {
          toast.success('자기 소개가 변경되었습니다.');
          setInfo(updates.info);
        }

        if (updates.profile_image && updates.profile_image !== profileImage) {
          toast.success('프로필 이미지가 변경되었습니다.');
        }

        await updateUserData(updates);
      } else {
        toast.error('프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      // console.error('프로필 업데이트 실패:', (error as Error).message);
      toast.error('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  if (userData) return <SettingSkeletonUi />;

  return (
    <>
      <Default>
        <SettingDefaultFlow
          profileImage={profileImage}
          handleImageClick={handleImageClick}
          handleImageUpload={handleImageUpload}
          inputRef={inputRef}
          nickname={nickname}
          me={me}
          info={info}
          updateProfile={updateProfile}
          updateUserData={updateUserData}
        />
      </Default>
      <Mobile>
        <SettingMobileFlow
          profileImage={profileImage}
          handleImageClick={handleImageClick}
          handleImageUpload={handleImageUpload}
          inputRef={inputRef}
          nickname={nickname}
          me={me}
          info={info}
          updateProfile={updateProfile}
          updateUserData={updateUserData}
        />
      </Mobile>
    </>
  );
};

export default ProfileSetting;
