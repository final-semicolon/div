import Down from '@/assets/images/common/Down';
import SortSetting from '@/assets/images/common/SortSetting';
import React, { useEffect, useRef, useState } from 'react';

type SortingOption = {
  type: 'time' | 'like' | 'comment';
  label: string;
};

type SortingFiltersProps = {
  sortingType: 'time' | 'like' | 'comment';
  onTypeChange: (type: 'time' | 'like' | 'comment') => void;
};

const SortingFilters = ({ sortingType, onTypeChange }: SortingFiltersProps) => {
  const menuButtonRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleMenuClickOutside = (event: MouseEvent) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMenuClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionClick = (type: 'time' | 'like' | 'comment') => {
    onTypeChange(type);
    setShowMenu(false);
  };

  const sortingOptions: SortingOption[] = [
    { type: 'time', label: '최신순' },
    { type: 'like', label: '좋아요순' },
    { type: 'comment', label: '댓글순' }
  ];

  return (
    <div className="flex">
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-between p-[8px_16px_8px_16px] w-[140px] h-[40px] mr-6 text-subtitle1 font-medium ${
          sortingType !== 'time'
            ? 'text-main-400 border border-main-400 rounded-lg bg-main-50'
            : 'text-neutral-700 border border-neutral-100 rounded-lg bg-white'
        }`}
      >
        <SortSetting />
        <p>{sortingOptions.find((option) => option.type === sortingType)?.label}</p>
        <Down />
      </button>
      {showMenu && (
        <div
          ref={menuButtonRef}
          className="absolute z-[1000] top-[28px] w-[140px] border overflow-hidden border-neutral-100 rounded-lg bg-white  hover:border hover:border-main-400 "
        >
          <li
            className={`flex items-center justify-between p-[8px_16px_8px_16px] h-[40px] text-subtitle1 font-medium ${
              sortingType === 'time' ? 'text-main-400' : 'text-neutral-700'
            } cursor-pointer`}
          >
            <SortSetting />
            필터
            <Down />
          </li>
          {sortingOptions.map((option) => (
            <p
              key={option.type}
              onClick={() => handleOptionClick(option.type)}
              className={`filters-item ${option.type ? 'hover:text-main-400 hover:bg-main-50' : 'text-neutral-700'}`}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortingFilters;
