import { Skeleton } from '@/components/ui/skeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const PopularQnaPostItemSkeleton = ({ index }: { index: number }) => (
  <>
    <Default>
      <li
        className={`border-t border-b border-neutral-100 p-4 flex flex-col min-h-[158px] ${
          index % 2 === 0 ? 'border-r' : 'border-l'
        }`}
      >
        <div className="flex justify-start items-center mb-5">
          <Skeleton className="w-1/12 h-6" />
          <Skeleton className="ml-2 w-3/4 h-6" />
        </div>
        <div className="flex-grow mb-3">
          <Skeleton className="w-full h-6" />
        </div>
        <div className="mt-auto flex justify-start items-center gap-2">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-16 h-6" />
        </div>
      </li>
    </Default>
    <Mobile>
      <div className="px-5">
        <li className={`border-b border-neutral-100 py-5 flex flex-col min-h-[117px]`}>
          <div className="flex justify-start items-center mb-2">
            <div className="w-1/12 h-[18px] bg-neutral-100 rounded"></div>
            <div className="ml-2 w-3/4 h-[18px] bg-neutral-100 rounded"></div>
          </div>
          <div className="flex mb-2 items-center">
            <div className="w-full h-[18px] bg-neutral-100 rounded"></div>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div className="w-16 h-[18px] bg-neutral-100 rounded"></div>
            <div className="w-16 h-[18px] bg-neutral-100 rounded"></div>
          </div>
        </li>
      </div>
    </Mobile>
  </>
);

const PopularQnaPaginationSkeleton = () => (
  <div className="flex justify-center items-center mt-4 space-x-2 gap-4 mb-[120px]">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="w-8 h-8 rounded bg-neutral-100 flex justify-center items-center">
        <p className="text-neutral-500 text-body1 font-medium text-center">{index + 1}</p>
      </div>
    ))}
  </div>
);

export const PopularQnaPostsSkeleton = () => (
  <>
    <Default>
      <div className="w-[1204px] mx-auto p-4">
        <ul className="grid grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <PopularQnaPostItemSkeleton key={index} index={index} />
          ))}
        </ul>
        <PopularQnaPaginationSkeleton />
      </div>
    </Default>
    <Mobile>
      <div className="min-w-[335px] mx-auto px-4">
        <ul className="flex flex-col">
          {[...Array(6)].map((_, index) => (
            <PopularQnaPostItemSkeleton key={index} index={index} />
          ))}
        </ul>
        <PopularQnaPaginationSkeleton />
      </div>
    </Mobile>
  </>
);

export const NoPostsPlaceholder = () => (
  <div className="w-full flex flex-col justify-center items-center" style={{ minHeight: '474px' }}>
    <p className="text-lg text-neutral-500">게시물이 없습니다.</p>
  </div>
);
