import Down from '@/assets/images/common/Down';
import SortSetting from '@/assets/images/common/SortSetting';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type SortingOption = {
  type: 'all' | 'time' | 'like' | 'comment';
  label: string;
};

type SortingFiltersProps = {
  sortingType: 'all' | 'time' | 'like' | 'comment';
  onTypeChange: (type: 'all' | 'time' | 'like' | 'comment') => void;
  showMenu: boolean;
  onShowMenu: Dispatch<SetStateAction<boolean>>;
};

const SortingFilters = ({ sortingType, onTypeChange, showMenu, onShowMenu }: SortingFiltersProps) => {
  const menuButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMenuClickOutside = (event: MouseEvent) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        onShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => document.removeEventListener('mousedown', handleMenuClickOutside);
  }, []);

  const toggleMenu = () => onShowMenu(!showMenu);
  const handleOptionClick = (type: 'all' | 'time' | 'like' | 'comment') => {
    onTypeChange(type);
    onShowMenu(false);
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
        className={`flex items-center justify-center p-[8px_0px] w-[109px] md:w-[140px] h-[40px] text-subtitle3 md:text-subtitle1 font-medium ${
          sortingType !== 'all'
            ? 'text-main-400 border border-main-400 rounded-lg bg-main-50'
            : 'text-neutral-700 border border-neutral-100 rounded-lg bg-white'
        }`}
      >
        <SortSetting stroke={`${sortingType !== 'all' ? '#423edf' : '#0F0F0F'}`} />
        <span className="mx-2">
          {sortingType === 'all' ? '필터' : sortingOptions.find((option) => option.type === sortingType)?.label}
        </span>
        <Down strokeWidth={1.5} stroke={`${sortingType !== 'all' ? '#423edf' : '#0F0F0F'}`} />
      </button>
      {showMenu && (
        <div
          ref={menuButtonRef}
          className="absolute z-[1000] top-[24px] md:top-[28px] w-[109px] md:w-[140px] border overflow-hidden border-neutral-100 rounded-lg bg-white hover:border hover:border-main-400 "
        >
          <li
            className={`flex items-center justify-center p-[8px_0px] h-[40px] text-subtitle3 md:text-subtitle1 font-medium ${
              sortingType === 'all' ? 'text-neutral-700' : ' text-main-400'
            } cursor-pointer`}
          >
            <SortSetting stroke={`${sortingType !== 'all' ? '#423edf' : '#0F0F0F'}`} />
            <span className="mx-2">
              {sortingType === 'all' ? '필터' : sortingOptions.find((option) => option.type === sortingType)?.label}
            </span>
            <Down strokeWidth={1.5} stroke={`${sortingType !== 'all' ? '#423edf' : '#0F0F0F'}`} />
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
