'use client';

import Down from '@/assets/images/common/Down';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { SortDropdownProps, SortOption } from '@/types/buttons/sortDropdown';
import { useState } from 'react';

const SortDropdownGrey = ({ sortBy, handleSortChange, sortOptions }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const selectedOptionLabel = sortOptions.find((option: SortOption) => option.value === sortBy)?.label;

  return (
    <>
      <Default>
        <div className="sort-dropdown relative w-[127px]">
          <div
            onClick={handleDropdownClick}
            className={`flex justify-between items-center h-[40px] px-4 py-2 bg-white border cursor-pointer ${
              isOpen
                ? 'rounded-tl-lg rounded-tr-lg border-main-400 border-b-0'
                : sortBy && sortBy !== 'latest'
                  ? 'rounded-lg border-main-400 bg-main-50 text-main-400'
                  : 'rounded-lg border-neutral-100 bg-white text-neutral-700'
            } ${!isOpen && sortBy !== 'latest' ? `hover:border-main-400` : ''}`}
          >
            <span className="flex-grow w-[71px] text-body1 font-medium text-center text-neutral-700">
              {selectedOptionLabel}
            </span>
            <Down />
          </div>
          {isOpen && (
            <div
              className="absolute w-full rounded-bl-lg rounded-br-lg bg-white shadow-lg z-10 border border-main-400 border-t-0 overflow-hidden"
              style={{ height: `${sortOptions.length * 40}px` }}
            >
              {sortOptions.map((option: SortOption, index: number) => (
                <div
                  key={option.value}
                  onClick={() => {
                    handleSortChange({ target: { value: option.value } } as React.ChangeEvent<HTMLSelectElement>);
                    setIsOpen(false);
                  }}
                  className={`flex justify-center items-center h-[40px] gap-2 px-3 py-1 cursor-pointer ${
                    index === sortOptions.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
                  } ${option.value === sortBy ? 'bg-main-50 text-main-400' : 'text-neutral-700'} hover:bg-main-50`}
                >
                  <span className="flex-grow-0 flex-shrink-0 w-[95px] text-body1 font-medium text-center ">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Default>
      <Mobile>
        <div className="sort-dropdown relative w-[77px]">
          <div
            onClick={handleDropdownClick}
            className={`flex justify-between items-center h-[28px] px-2 py-1 border cursor-pointer ${
              isOpen
                ? 'rounded-tl-lg rounded-tr-lg border-main-400 border-b-0'
                : sortBy && sortBy !== 'latest'
                  ? 'rounded-lg border-main-400 bg-main-50 text-main-400'
                  : 'rounded-lg border-neutral-100 bg-white text-neutral-700'
            } ${!isOpen && sortBy !== 'latest' ? `hover:border-main-400` : ''}`}
          >
            <span className="flex-grow w-[45px] text-body4 font-medium text-center ">{selectedOptionLabel}</span>
            <Down width={16} height={16} stroke={'#292929'} />
          </div>
          {isOpen && (
            <div
              className="absolute w-full rounded-bl-lg rounded-br-lg bg-white shadow-lg z-10 border border-main-400 border-t-0 overflow-hidden"
              style={{ height: `${sortOptions.length * 36}px` }}
            >
              {sortOptions.map((option: SortOption, index: number) => (
                <div
                  key={option.value}
                  onClick={() => {
                    handleSortChange({ target: { value: option.value } } as React.ChangeEvent<HTMLSelectElement>);
                    setIsOpen(false);
                  }}
                  className={`flex justify-center items-center h-[40px]px-[21.5px] py-2 cursor-pointer ${
                    index === sortOptions.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
                  } ${option.value === sortBy ? 'bg-main-50 text-main-400' : 'text-neutral-700'} hover:bg-main-50`}
                >
                  <span className="flex-grow-0 flex-shrink-0 text-body4 font-medium text-center ">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Mobile>
    </>
  );
};

export default SortDropdownGrey;
