import { Skeleton } from '@/components/ui/skeleton';

const PopularQnaPostItemSkeleton = ({ index }: { index: number }) => (
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
);

const PopularQnaPaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-4 mt-8">
    {[...Array(3)].map((_, index) => (
      //   <Skeleton key={index} className="w-[33px] h-[32px] rounded-md" />
      <div key={index} className="w-[33px] h-[32px] flex justify-center items-center rounded-md bg-neutral-100">
        <p className="text-neutral-500 text-body1 font-medium text-left">{index + 1}</p>
      </div>
    ))}
  </div>
);

export const PopularQnaPostsSkeleton = () => (
  <div className="w-[1204px] mx-auto p-4">
    <ul className="grid grid-cols-2">
      {[...Array(6)].map((_, index) => (
        <PopularQnaPostItemSkeleton key={index} index={index} />
      ))}
    </ul>
    <PopularQnaPaginationSkeleton />
  </div>
);

export const NoPostsPlaceholder = () => (
  <div className="w-full flex flex-col justify-center items-center" style={{ minHeight: '474px' }}>
    <p className="text-lg text-neutral-500">게시물이 없습니다.</p>
  </div>
);
