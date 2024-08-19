import useActiveTabStore from '@/store/useActiveTabStore';
import useProfiletopTabStore from '@/store/useProfiletopTabStore';
import Link from 'next/link';
import { useEffect } from 'react';

const HaderMobile = () => {
  const topButtonTab = useProfiletopTabStore((state) => state.topButtonTab);
  const settopButtonTab = useProfiletopTabStore((state) => state.settopButtonTab);

  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);

  useEffect(() => {
    if (topButtonTab === '') {
      settopButtonTab('profile');
    }
  }, [topButtonTab, settopButtonTab]);

  const handleTabClick = (tab: 'profile' | 'posts' | 'likes' | 'bookmarks') => {
    if (topButtonTab === 'profile') {
      settopButtonTab(tab);
    } else {
      settopButtonTab(tab);
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="flex justify-between px-5">
        <Link href="/profile">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButtonTab === 'profile' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('profile')}
          >
            프로필
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButtonTab === 'posts' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('posts')}
          >
            내가 쓴 글
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButtonTab === 'likes' && 'border-b-4 border-black'}`}
            onClick={() => handleTabClick('likes')}
          >
            좋아요
          </p>
        </Link>
        <Link href="/profile/activities">
          <p
            className={`pb-4 w-[77px] flex justify-center ${topButtonTab === 'bookmarks' && 'border-b-4 border-black'}`}
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
