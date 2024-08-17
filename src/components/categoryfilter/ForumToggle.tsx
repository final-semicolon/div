import React, { useEffect, useRef, useState } from 'react';
import DownResponsive from '../common/DownResponsive';

type primaryForumOption = {
  type: '전체' | '일상' | '커리어' | '자기개발' | '토론' | '코드리뷰';
  label: string;
};

type ForumToggleProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
};
const ForumToggle = ({
  primaryCategory,
  primaryForumCategory,
  onCategoryChange,
  onForumCategoryChange
}: ForumToggleProps) => {
  const [showForumMenu, setShowForumMenu] = useState(false);

  const forumMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleForumMenuClickOutside = (event: MouseEvent) => {
      if (forumMenuRef.current && !forumMenuRef.current.contains(event.target as Node)) {
        setShowForumMenu(false);
      }
    };

    document.addEventListener('mousedown', handleForumMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleForumMenuClickOutside);
    };
  }, []);

  const toggleForumMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowForumMenu(!showForumMenu);
    const value = (e.target as HTMLButtonElement).value;
    if (value === '전체') {
      onCategoryChange('forum');
      onForumCategoryChange(null);
    } else if (value) {
      onCategoryChange('forum');
      onForumCategoryChange(value);
    } else {
      onCategoryChange('forum');
    }
  };

  const handleForumCategoryClick = (type: '전체' | '일상' | '커리어' | '자기개발' | '토론' | '코드리뷰') => {
    onForumCategoryChange(type);
    setShowForumMenu(false);
  };

  const forumCategories: primaryForumOption[] = [
    { type: '전체', label: '포럼' },
    { type: '일상', label: '일상' },
    { type: '커리어', label: '커리어' },
    { type: '자기개발', label: '자기개발' },
    { type: '토론', label: '토론' },
    { type: '코드리뷰', label: '코드리뷰' }
  ];

  const currentForumCategoryLabel =
    forumCategories.find((category) => category.type === primaryForumCategory)?.label || '포럼';

  return (
    <div className=" ">
      <button
        onClick={toggleForumMenu}
        className={`relative md:w-[118px] h-[40px] p-[8px_16px] mr-2 md:mr-6 flex items-center justify-center text-subtitle3 md:text-subtitle1 font-medium ${
          primaryCategory === 'forum' ? 'filter-active' : 'filter-inactive'
        }`}
      >
        <p className="min-w-[32px] max-w-[90px] whitespace-nowrap">{currentForumCategoryLabel}</p>
        <DownResponsive stroke={primaryForumCategory === '전체' ? '#423edf' : '#0F0F0F'} />
        {showForumMenu && (
          <div
            ref={forumMenuRef}
            className="absolute z-[1000] top-[-1px] w-[calc(100%+2px)] md:w-[118px] border border-neutral-100 rounded-lg overflow-hidden bg-white  hover:border hover:border-main-400"
          >
            <li
              onClick={() => handleForumCategoryClick('전체')}
              className={`flex items-center justify-center p-[8px_16px] h-[40px] text-subtitle3 md:text-subtitle1 font-medium  ${
                primaryForumCategory === '전체' ? ' text-main-400 ' : ' text-neutral-700'
              } cursor-pointer`}
            >
              <span className="md:mr-2">포럼</span>
              <DownResponsive stroke={primaryForumCategory === '전체' ? '#423edf' : '#0F0F0F'} />
            </li>
            {forumCategories.map((option) => (
              <li
                key={option.type}
                onClick={() => handleForumCategoryClick(option.type)}
                className={`filters-item ${option.type ? 'hover:text-main-400 hover:bg-main-50' : 'text-neutral-700'}`}
              >
                {option.type}
              </li>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

export default ForumToggle;
