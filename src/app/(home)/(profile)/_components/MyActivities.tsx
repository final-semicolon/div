'use client';

import useActiveTabStore from '@/store/useActiveTabStore';
import MyPostsList from './myactivities/MyPostsList';
import LikesList from './myactivities/LikesList';
import MyActivitiesHeader from './myactivities/MyActivitiesHeader';
import BookmarksList from './myactivities/BookmarksList';
import { useAuth } from '@/context/auth.context';
import Image from 'next/image';
import { useState } from 'react';
import FilterControls from './myactivities/common/FilterControls';
import { Default } from '@/hooks/common/useMediaQuery';

const MyActivities = () => {
  const [postCount, setPostCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [primaryCategory, setPrimaryCategory] = useState<'all' | 'qna' | 'forum' | 'archive'>('all');
  const [primaryForumCategory, setPrimaryForumCategory] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'all' | 'post' | 'comment'>('all');

  const activeTab = useActiveTabStore((state) => state.activeTab);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);
  const { userData } = useAuth();

  const handleTotalsChange = (postCount: number, commentCount: number) => {
    setPostCount(postCount);
    setCommentCount(commentCount);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <MyPostsList
            onTotalsChange={handleTotalsChange}
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            contentType={contentType}
            onCategoryChange={setPrimaryCategory}
            onForumCategoryChange={setPrimaryForumCategory}
            onTypeChange={setContentType}
          />
        );
      case 'likes':
        return (
          <LikesList
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            contentType={contentType}
            onCategoryChange={setPrimaryCategory}
            onForumCategoryChange={setPrimaryForumCategory}
            onTypeChange={setContentType}
          />
        );
      case 'bookmarks':
        return (
          <BookmarksList
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            contentType={contentType}
            onCategoryChange={setPrimaryCategory}
            onForumCategoryChange={setPrimaryForumCategory}
            onTypeChange={setContentType}
          />
        );
    }
  };

  return (
    <div>
      <Default>
        <div className="border w-[850px] mb-[57px] border-sub-100 rounded-2xl p-[0_24px]">
          <div className="flex flex_clo items-center my-3">
            <div className="relative w-12 h-12 border border-neutral-50 rounded-full overflow-hidden bg-white cursor-pointer">
              {userData?.profile_image && (
                <Image
                  src={userData.profile_image}
                  alt="프로필 이미지"
                  fill
                  priority
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              )}
            </div>
            <span className="text-neutral-800 text-h5 font-bold ml-4">{userData?.nickname}</span>
          </div>
          <div className="my-3">
            <span className="text-body1 text-neutral-700 font-regular">총 게시글 </span>
            <span className="text-body1 text-main-400 font-regular"> {postCount} </span>
            <span className="text-body1 text-neutral-700 font-regular">개 </span>
            <span className="border-r-2 border-neutral-100 mx-[8px]" />
            <span className="text-body1 text-neutral-700 font-regular"> 총 댓글 </span>
            <span className="text-body1 text-main-400 font-regular"> {commentCount}</span>
            <span className="text-body1 text-neutral-700 font-regular"> 개 </span>
          </div>
        </div>
        <MyActivitiesHeader setActiveTab={setActiveTab} activeTab={activeTab} />
        <div className="relative">
          <FilterControls
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            contentType={contentType}
            onCategoryChange={setPrimaryCategory}
            onForumCategoryChange={setPrimaryForumCategory}
            onTypeChange={setContentType}
          />
        </div>
      </Default>{' '}
      {renderActiveTab()}
    </div>
  );
};

export default MyActivities;
