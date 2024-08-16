import ArchivePostCardSkeleton from './ArchivePostCardSkeleton';

const ArchivePostsSkeleton = () => {
  return (
    <>
      <div className="mb-9">
        <p className="text-subtitle1 text-neutral-400 font-medium mb-3">Level Up Course</p>
        <p className="text-h3 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
        <div className="flex items-center justify-between text-subtitle1 font-medium text-neutral-700 mt-6">
          <p className="flex items-center ">
            전체 게시글
            <p className="flex items-center text-subtitle1 font-bold text-neutral-800 ml-1">(로딩 중...)</p>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[...Array(6)].map((_, index) => (
          <ArchivePostCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export default ArchivePostsSkeleton;
