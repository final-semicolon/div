import Down from '@/assets/images/common/Down';
import React, { useEffect, useRef, useState } from 'react';
import CategoryButton from './CategoryButton';

type primaryForumOption = {
  type: '전체' | '일상' | '커리어' | '자기개발' | '토론' | '코드리뷰';
  label: string;
};

type PrimaryCategoriesProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
};

const PrimaryCategories = ({
  primaryCategory,
  primaryForumCategory,
  onCategoryChange,
  onForumCategoryChange
}: PrimaryCategoriesProps) => {
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

  const handleCategoryClick = (category: 'all' | 'qna' | 'forum' | 'archive') => {
    onCategoryChange(category);
    onForumCategoryChange(null);
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
    <div className="flex">
      <CategoryButton category="all" currentCategory={primaryCategory} onClick={() => handleCategoryClick('all')} />
      <div>
        <button
          onClick={toggleForumMenu}
          className={`w-[118px] h-[40px] p-[8px_16px_8px_16px] mr-6 flex items-center justify-between text-subtitle1 font-medium ${
            primaryCategory === 'forum' ? 'filter-active' : 'filter-inactive'
          }`}
        >
          <p className="w-[64px]">{currentForumCategoryLabel}</p>
          <Down />
        </button>

        {showForumMenu && (
          <div
            ref={forumMenuRef}
            className="absolute z-[1000] top-[27px] w-[118px] border border-neutral-100 rounded-lg bg-white  hover:border hover:border-main-400"
          >
            <li
              onClick={() => handleForumCategoryClick('전체')}
              className={`flex items-center justify-between p-[8px_16px_8px_32px] h-[40px] text-subtitle1 font-medium  ${
                primaryForumCategory === '전체' ? ' text-main-400 ' : ' text-neutral-700'
              } cursor-pointer`}
            >
              포럼
              <Down />
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
      </div>
      <CategoryButton category="qna" currentCategory={primaryCategory} onClick={() => handleCategoryClick('qna')} />
      <CategoryButton
        category="archive"
        currentCategory={primaryCategory}
        onClick={() => handleCategoryClick('archive')}
      />
    </div>
  );
};

export default PrimaryCategories;
