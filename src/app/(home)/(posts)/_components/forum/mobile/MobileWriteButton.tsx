import { UserData } from '@/context/auth.context';
import Image from 'next/image';

type MobileWriteButtonProps = {
  userData: UserData | null;
};

const MobileWriteButton = ({ userData }: MobileWriteButtonProps) => {
  if (!userData) {
    return null;
  }
  return (
    <div className="flex items-center border-b mt-6 h-[60px]">
      <div className="relative w-9 h-9 ml-5">
        {userData?.profile_image && (
          <Image
            src={userData.profile_image}
            alt="User Profile"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex ml-3 text-body3 font-regular text-neutral-400 ">이곳을 터치하고 자유롭게 소통해 보세요!</div>
    </div>
  );
};

export default MobileWriteButton;
