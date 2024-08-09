'use client';

import Image from 'next/image';
import EditIcon from '@/assets/images/common/EditIcon';

interface ProfileImageProps {
  profileImage: string;
  onImageClick: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ProfileImage = ({ profileImage, onImageClick, onImageUpload, inputRef }: ProfileImageProps) => {
  return (
    <div className="relative w-32 h-32 border border-neutral-50 rounded-full overflow-hidden bg-white cursor-pointer">
      {profileImage && (
        <Image src={profileImage} alt="Profile" fill priority className="rounded-full object-cover" sizes="120px" />
      )}
      <input type="file" className="hidden" ref={inputRef} onChange={onImageUpload} accept=".png" />
      <div
        className="absolute inset-0 center-alignment opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-full"
        onClick={onImageClick}
      >
        <span className="text-white text-title">+</span>
      </div>
      <div
        className="absolute cursor-pointer border border-sub-50 rounded-full right-[-75px] top-[-50px]"
        onClick={onImageClick}
      >
        <EditIcon />
      </div>
    </div>
  );
};

export default ProfileImage;
