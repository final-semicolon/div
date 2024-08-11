import { UserMenuProps } from '@/types/header/headerTypes';
import Image from 'next/image';
import Link from 'next/link';
import Chip from '../common/Chip';

const UserMenu = ({ isLoggedIn, userData }: UserMenuProps) => {
  return (
    <>
      {isLoggedIn ? (
        <div className="ml-[198px] flex items-center">
          <Link href={'/profile'}>
            {userData && userData.profile_image && (
              <div className="items-center relative w-10 h-10 mr-4">
                <Image
                  src={userData.profile_image}
                  alt="Profile"
                  sizes="40px"
                  className="rounded-full object-cover"
                  fill
                  priority
                />
              </div>
            )}
          </Link>
          <Link href={'/posting'}>
            <div className="items-center">
              <Chip intent={'primary'} size={'small'} label="글쓰기" />
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex items-center ml-[95px]">
          <Link href={'/login'}>
            <div className="font-medium text-subtitle1 text-neutral-500 w-[47px] h-[24px]">로그인</div>
          </Link>
          <div className="w-0.5 h-[18px] my-1 mx-4 bg-neutral-50" />
          <Link href={'/signup'}>
            <div className="font-medium text-subtitle1 text-neutral-500 w-[62px] h-[24px] mr-4">회원가입</div>
          </Link>
          <Link href={'/login'}>
            <Chip intent={'primary'} size={'small'} label="글쓰기" />
          </Link>
        </div>
      )}
    </>
  );
};

export default UserMenu;
