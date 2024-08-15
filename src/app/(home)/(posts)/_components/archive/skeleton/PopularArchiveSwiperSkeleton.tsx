import ArchivePostCardSkeleton from './ArchivePostCardSkeleton';

const PopularArchiveSwiperSkeleton = () => {
  return (
    <div className="flex space-x-4 w-full justify-between">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex-shrink-0 w-[388px]">
          <ArchivePostCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default PopularArchiveSwiperSkeleton;
