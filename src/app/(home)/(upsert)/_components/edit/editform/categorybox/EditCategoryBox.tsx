import { usePostingCategoryStore } from '@/store/postingCategoryStore';
import UpsertTheme from '../../../UpsertTheme';
import Down from '@/assets/images/common/Down';
import { FORUM_SUB_CATEGORY_LIST, SUB_CATEGORY_TEXT } from '@/constants/upsert';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { MouseEventHandler } from 'react';

const EditCategoryBox = () => {
  const { categoryGroup, subCategory, setSubCategory, categoryOpen, subCategoryOpen, setSubCategoryOpen } =
    usePostingCategoryStore();

  const handleForumSubCategoryDivClick: MouseEventHandler<HTMLDivElement> = () => {
    setSubCategoryOpen();
  };

  const handleSubCategoryClick: MouseEventHandler<HTMLLIElement> = (event) => {
    setSubCategory(event.currentTarget.innerText);
  };

  return (
    <>
      <div className="flex flex-col gap-4 my-2">
        <span className="text-gray-400 ">{categoryGroup.category ? <UpsertTheme /> : null}</span>
      </div>
      <Default>
        <div className="flex flex-col md:mb-6">
          <div
            className={`bg-neutral-50 text-neutral-200 md:max-w-[339px] md:max-h-[51px] flex items-center justify-between text-body1 px-6 py-3 border rounded-lg shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          >
            <span className="md:max-w-[257px]">{categoryGroup.category}</span>
          </div>
        </div>
        <div
          className={`${categoryGroup.category === '포럼' ? '' : 'hidden'} relative md:max-w-[339px] md:max-h-[51px] flex items-center justify-between text-body1 px-6 py-3 border cursor-pointer rounded-lg ${categoryOpen || categoryGroup.category === '' || subCategory === SUB_CATEGORY_TEXT ? 'border-neutral-100' : 'border-main-400 text-main-400'}   shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          onClick={handleForumSubCategoryDivClick}
        >
          <span className="md:max-w-[257px]">{subCategory}</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <Down />
          </div>
          <ul
            className={`${subCategoryOpen && categoryGroup.category === '포럼' ? '' : 'hidden'} mt-2 top-12 left-0 w-[337px] h-[257px] text-body1 z-10 bg-white  absolute  border rounded-lg border-neutral-100 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          >
            {FORUM_SUB_CATEGORY_LIST.map((SUB_CATEGORY, index) => {
              return (
                <li
                  className={`z-10 pl-6 pr-14 py-3 h-[51px] cursor-pointer  ${index === 0 ? 'rounded-t-lg' : index === FORUM_SUB_CATEGORY_LIST.length - 1 ? 'rounded-b-lg' : ''} ${
                    SUB_CATEGORY === subCategory ? 'bg-main-100 text-main-400' : 'bg-white'
                  } hover:bg-main-100 hover:text-main-400`}
                  key={SUB_CATEGORY}
                  onClick={handleSubCategoryClick}
                >
                  {SUB_CATEGORY}
                </li>
              );
            })}
          </ul>
        </div>
      </Default>
      <Mobile>
        <div className="flex flex-col md:mb-6">
          <div
            className={`bg-neutral-50 text-neutral-200 w-[187px] h-[37px] flex items-center justify-between text-body3 px-4 py-2 border rounded-lg shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          >
            <span className="md:max-w-[257px]">{categoryGroup.category}</span>
          </div>
        </div>
        <div
          className={`${categoryGroup.category === '포럼' ? '' : 'hidden'} relative w-[144px] h-[37px] flex items-center justify-between text-body3 px-4 py-2 border cursor-pointer rounded-lg ${categoryOpen || categoryGroup.category === '' || subCategory === SUB_CATEGORY_TEXT ? 'border-neutral-100' : 'border-main-400 text-main-400'}   shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          onClick={handleForumSubCategoryDivClick}
        >
          <span className="md:max-w-[257px]">{subCategory}</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <Down width={20} height={20} />
          </div>
          <ul
            className={`${subCategoryOpen && categoryGroup.category === '포럼' ? '' : 'hidden'} mt-2 top-8 left-0 w-full  text-body3 z-10 bg-white  absolute  border rounded-lg border-neutral-100 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]`}
          >
            {FORUM_SUB_CATEGORY_LIST.map((SUB_CATEGORY, index) => {
              return (
                <li
                  className={`z-10 px-4 py-2 h-[37px] cursor-pointer  ${index === 0 ? 'rounded-t-lg' : index === FORUM_SUB_CATEGORY_LIST.length - 1 ? 'rounded-b-lg' : ''} ${
                    SUB_CATEGORY === subCategory ? 'bg-main-100 text-main-400' : 'bg-white text-neutral-700'
                  } hover:bg-main-100 hover:text-main-400`}
                  key={SUB_CATEGORY}
                  onClick={handleSubCategoryClick}
                >
                  {SUB_CATEGORY}
                </li>
              );
            })}
          </ul>
        </div>
      </Mobile>
    </>
  );
};

export default EditCategoryBox;
