import { Mobile } from '@/hooks/common/useMediaQuery';
import SearchSkeletonCard from './SearchSkeletonCard';

const SearchSkeletonUi = () => {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="px-5">
      <Mobile>
        <div className="mb-10 search-skeleton h-[48px] w-full" />
      </Mobile>
      <p className="search-skeleton w-[100px] md:w-[200px] h-6 md:h-[32px] mb-[40px] md:mb-[88px]" />
      <p className="search-skeleton w-[100px] md:w-[150px] h-6 mb-[20px] md:mb-[40px]" />
      <div className="flex mb-4 md:mb-7">
        <p className="mr-3 search-skeleton w-[76px] md:w-[118px] h-[32px] md:h-[40px]" />
        <p className="mr-3 search-skeleton w-[76px] md:w-[118px] h-[32px] md:h-[40px]" />
        <p className="mr-3 search-skeleton w-[76px] md:w-[118px] h-[32px] md:h-[40px]" />
        <p className="mr-3 search-skeleton w-[76px] md:w-[118px] h-[32px] md:h-[40px]" />
        <p className="mr-3 md:ml-auto search-skeleton w-[76px] md:w-[118px] h-[32px] md:h-[40px]" />
      </div>
      <div className="grid grid-cols-1 gap-y-9 gap-x-5 md:grid-cols-2 justify-center">
        {skeletonCards.map((_, index) => (
          <SearchSkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default SearchSkeletonUi;
