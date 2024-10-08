import Down from '@/assets/images/common/Down';
import X from '@/assets/images/common/X';
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SelectTagInputProps = {
  tagList: Ttag[];
  setTagList: Dispatch<SetStateAction<Array<Ttag>>>;
};

const SelectTagInput = ({ tagList, setTagList }: SelectTagInputProps) => {
  const [openTag, setOpenTag] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const handleOpenTag: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    setOpenTag((prev) => !prev);
  };

  const handleSelect = (tag: Ttag): void => {
    if (selectedCount >= 3) {
      toast.error('태그는 3개까지만 선택이 가능합니다.');
      return;
    }
    setTagList(
      tagList.map((TAG) => {
        return TAG.name === tag.name ? { name: tag.name, selected: !tag.selected } : TAG;
      })
    );
  };

  const handleRemoveTag = (tag: Ttag): void => {
    setTagList(
      tagList.map((TAG) => {
        return TAG.name === tag.name ? { name: tag.name, selected: !tag.selected } : TAG;
      })
    );
  };

  useEffect(() => {
    setSelectedCount(tagList.filter((tag) => tag.selected).length);
  }, [tagList]);

  return (
    <div
      className="whitespace-nowrap min-h-[37px] md:min-h-[51px] flex flex-col text-neutral-900 text-body3 md:text-body1 border rounded-md md:rounded-xl border-neutral-100 focus:border-main-400 outline-none relative "
      id="tag"
      onClick={handleOpenTag}
    >
      <div className=" min-h-[37px] md:min-h-[51px] flex  items-center  gap-2 px-4 py-2 md:px-6 md:py-2 cursor-pointer overflow-auto">
        <p className={`${selectedCount > 0 ? 'hidden' : ''} text-neutral-400 `}>
          태그를 선택하세요! (최대 3개까지 가능해요)
        </p>
        {tagList
          .filter((tag) => tag.selected === true)
          .map((tag) => {
            return (
              <div
                key={'selectedTag' + tag.name}
                className="flex items-center text-neutral-700 font-medium gap-1 bg-neutral-50 px-3 py-1 rounded "
              >
                <div className="text-caption2 md:text-subtitle2">#{tag.name}</div>
                <button
                  type="button"
                  className="w-4 h-4 p-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                >
                  <X width={8} height={8} />
                </button>
              </div>
            );
          })}
        <div className="ml-auto md:hidden">
          <Down width={20} height={20} />
        </div>
        <div className="ml-auto hidden md:block">
          <Down />
        </div>
      </div>
      <div className="relative z-10 ">
        <ul
          className={`${openTag ? '' : 'hidden '} w-full h-[185px] md:h-[271px] mt-2 flex flex-col gap-2 absolute overflow-auto bg-white md:py-3 border rounded-md md:rounded-xl shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)] `}
          id="select-tag-list"
        >
          {tagList
            .filter((tag) => tag.selected === false)
            .map((tag, index, selectedTagList) => {
              return (
                <li
                  className={`${
                    index === 0
                      ? 'rounded-t-md md:rounded-none'
                      : index === selectedTagList.length - 1
                        ? 'rounded-b-md md:rounded-none'
                        : ''
                  } px-4 md:px-6 py-2 hover:bg-main-100 text-neutral-900 hover:text-neutral-700 cursor-pointer `}
                  key={tag.name}
                  onClick={() => {
                    handleSelect(tag);
                  }}
                >
                  <div className="text-body3 md:text-body1  ">{tag.name}</div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default SelectTagInput;
