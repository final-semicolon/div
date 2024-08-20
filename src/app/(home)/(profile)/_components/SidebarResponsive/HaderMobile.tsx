import Link from 'next/link';
import React, { useState } from 'react';

const HaderMobile = () => {
  const [topButton, setTopButton] = useState<'profile' | 'posts' | 'likes' | 'bookmarks'>('profile');
  return (
    <>
      <div className="flex justify-between px-5">
        <Link href="/profile">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'profile' && 'border-b-4 border-black'}`}
            onClick={() => setTopButton('profile')}
          >
            프로필
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'posts' && 'border-b-4 border-black'}`}
            onClick={() => setTopButton('posts')}
          >
            내가 쓴 글
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'likes' && 'border-b-4 border-black'}`}
            onClick={() => setTopButton('likes')}
          >
            좋아요
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButton === 'bookmarks' && 'border-b-4 border-black'}`}
            onClick={() => setTopButton('bookmarks')}
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
