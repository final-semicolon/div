import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import OptionsResponsive from '../common/OptionsResponsive';

type ContentOption = {
  type: 'all' | 'post' | 'comment';
  label: string;
};

type ContentFiltersProps = {
  contentType: 'all' | 'post' | 'comment';
  onTypeChange: (type: 'all' | 'post' | 'comment') => void;
  showMenu: boolean;
  onShowMenu: Dispatch<SetStateAction<boolean>>;
};

const ContentFilters = ({ contentType, onTypeChange, showMenu, onShowMenu }: ContentFiltersProps) => {
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
  const handleOptionClick = (type: 'all' | 'post' | 'comment') => {
    onTypeChange(type);
    onShowMenu(false);
  };

  const ContentOptions: ContentOption[] = [
    { type: 'post', label: '게시글' },
    { type: 'comment', label: '댓글' }
  ];

  return (
    <div className="flex">
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center p-[8px_0px] w-[109px] md:w-[127px] h-[40px] text-subtitle3 md:text-subtitle1 font-medium ${
          contentType !== 'all'
            ? 'text-main-400 border border-main-400 rounded-lg bg-main-50'
            : 'text-neutral-700 border border-neutral-100 rounded-lg bg-white'
        }`}
      >
        <OptionsResponsive
          isType="sort"
          stroke={contentType !== 'all' ? '#423edf' : '#0F0F0F'}
          options={contentType === 'all' ? '필터' : ContentOptions.find((option) => option.type === contentType)?.label}
        />
      </button>
      {showMenu && (
        <div
          ref={menuButtonRef}
          className="absolute z-10 top-[24px] w-[109px] md:w-[127px] border overflow-hidden border-neutral-100 rounded-lg bg-white hover:border hover:border-main-400 "
        >
          <li
            className={`flex items-center justify-center p-[8px_0px] h-[40px] text-subtitle3 md:text-subtitle1 font-medium ${
              contentType === 'all' ? 'text-neutral-700' : ' text-main-400'
            } cursor-pointer`}
          >
            <OptionsResponsive
              isType="sort"
              stroke={contentType !== 'all' ? '#423edf' : '#0F0F0F'}
              options={
                contentType === 'all' ? '필터' : ContentOptions.find((option) => option.type === contentType)?.label
              }
            />
          </li>
          {ContentOptions.map((option) => (
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

export default ContentFilters;
