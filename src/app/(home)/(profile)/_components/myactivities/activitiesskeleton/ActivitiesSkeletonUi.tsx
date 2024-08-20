import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import ActivitiesSkeletonCard from './ActivitiesSkeletonCard';

const ActivitiesSkeletonUi = () => {
  const skeletonCard = Array.from({ length: 6 }, (_, index) => index);
  return (
    <>
      <Default>
        <div className="flex mt-6 mb-10">
          <p className="mr-3 profile-skeleton w-[126px] h-[40px]" />
          <p className="mr-3 profile-skeleton w-[63px] h-[40px]" />
        </div>
      </Default>
      <Mobile>
        <div className="p-[32px_20px]">
          <p className="mb-6 profile-skeleton w-[90px] h-[20px]" />
          <div className="flex">
            <p className="mr-3 profile-skeleton w-[63px] h-[36px]" />
            <p className="mr-3 profile-skeleton w-[63px] h-[36px]" />
            <p className="mr-3 profile-skeleton w-[63px] h-[36px]" />
            <p className="mr-3 profile-skeleton w-[63px] h-[36px]" />
          </div>
          <div className="flex mt-6">
            <p className="mr-3 profile-skeleton w-[88px] h-[36px]" />
            <p className="mr-3 profile-skeleton w-[57px] h-[36px]" />
            <p className="mr-3 ml-auto profile-skeleton w-[87px] h-[36px]" />
          </div>
        </div>
      </Mobile>
      {skeletonCard.map((_, index) => (
        <ActivitiesSkeletonCard key={index} />
      ))}
    </>
  );
};

export default ActivitiesSkeletonUi;

{
  /* <Mobile> 
  <div className="p-[32px_20px]">

  <PrimaryCategories
    primaryCategory={primaryCategory}
    primaryForumCategory={primaryForumCategory}
    onCategoryChange={onCategoryChange}
    onForumCategoryChange={onForumCategoryChange}
    showForumMenu={showForumMenu}
    onShowForumMenu={setShowForumMenu}
  />
</div>
<div className="flex items-center justify-between p-[8px_20px] text-subtitle3">
  <div className="flex">
    <label className="flex items-center">
      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} hidden />
      {selectedItems.size === 0 ? (
        <span className="mr-4 flex border border-neutral-200 text-neutral-500 rounded-lg p-2 h-9">
          <Check stroke="#757575" width={20} height={20} strokeWidth={1.4} />
          전체선택
        </span>
      ) : (
        <span className="mr-4 flex border border-main-400 text-main-400 bg-sub-50  rounded-lg p-2 h-9">
          <Check stroke="#423edf" width={20} height={20} strokeWidth={1.4} />
          전체선택
        </span>
      )}
    </label>
    {selectedItems.size === 0 ? (
      <button
        onClick={() => toast.error('삭제할 게시물을 선택해주세요')}
        className="border border-neutral-200 text-neutral-500 rounded-lg p-[8px_16px] h-9"
      >
        삭제
      </button>
    ) : (
      <button
        onClick={() => setConfirmModalOpen(true)}
        className="border border-neutral-200 text-neutral-500 rounded-lg p-[8px_16px] h-9"
      >
        {selectedItems.size} 삭제
      </button>
    )}
  </div>
  <div className="flex">
    {primaryCategory === 'all' && contentType === 'all' ? (
      <div className="mx-2"></div>
    ) : (
      <div className="mx-2" onClick={handleResetClick}>
        <Reset />
      </div>
    )}
    <div className="relative">
      <ContentFilters
        contentType={contentType}
        onTypeChange={onTypeChange}
        showMenu={showMenu}
        onShowMenu={setShowMenu}
      />
    </div>
  </div>
</div>
</Mobile> */
}
