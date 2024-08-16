import { UserMenuProps } from '@/types/header/headerTypes';
import Image from 'next/image';
import Link from 'next/link';
import Chip from '../common/Chip';
import { memo } from 'react';
import SearchButton from '@/assets/images/header/SearchButton';

const UserMenu = ({ isLoggedIn, userData }: UserMenuProps) => (
  // <div className={`${isLoggedIn ? 'ml-[198px]' : 'ml-[95px]'}`}>
  <>
    {isLoggedIn ? (
      <div className="w-[175px] flex items-center ">
        <div className="search-button-visible mr-4">
          <Link href={'/search'}>
            <SearchButton />
          </Link>
        </div>
        {userData?.profile_image && (
          <Link href={'/profile'}>
            <div className="relative w-10 h-10 mr-4">
              <Image
                src={userData.profile_image}
                alt="Profile"
                sizes="40px"
                className="rounded-full object-cover"
                fill
                priority
              />
            </div>
          </Link>
        )}
        <Link href={'/posting'}>
          <Chip intent={'primary'} size={'small'} label="글쓰기" />
        </Link>
      </div>
    ) : (
      <div className="w-[278px] flex items-center ">
        <div className="search-button-visible mr-4">
          <Link href={'/search'}>
            <SearchButton />
          </Link>
        </div>
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
  // </div>
);

export default memo(UserMenu);
