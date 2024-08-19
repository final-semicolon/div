import useActiveTabStore from '@/store/useActiveTabStore';
import Link from 'next/link';
import React, { useState } from 'react';

const HaderMobile = () => {
  const [topButton, setTopButton] = useState<'profile' | 'posts' | 'likes' | 'bookmarks'>('profile');
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);

  const handleTabClick = (tab: 'profile' | 'posts' | 'likes' | 'bookmarks') => {
    setTopButton(tab);
    if (tab !== 'profile') {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="flex justify-between px-5">
        <Link href="/profile">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'profile' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('profile')}
          >
            프로필
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'posts' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('posts')}
          >
            내가 쓴 글
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'likes' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('likes')}
          >
            좋아요
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'bookmarks' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('bookmarks')}
          >
            북마크
          </p>
        </Link>
      </div>
      <div className="h-2 bg-neutral-50"></div>
    </>
  );
};

export default HaderMobile;
