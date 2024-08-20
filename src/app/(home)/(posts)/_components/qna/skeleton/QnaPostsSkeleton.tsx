import { Skeleton } from '@/components/ui/skeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { memo } from 'react';

const QnaPostItemSkeleton = () => (
  <>
    <Default>
      <div className="max-w-[1204px]">
        <li className="border-b border-neutral-100 p-5">
          <div className="block">
            <div className="flex items-start mb-5 max-h-[27px]">
              <Skeleton className="w-6 h-6 mr-[2px]" />
              <Skeleton className="w-3/4 h-6" />
            </div>
            <div className="flex placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
              <div className="flex-grow">
                <Skeleton className="w-full h-[54px]" />
              </div>
              <div className="flex flex-col items-center justify-center ml-4 p-2 border rounded-md text-center min-w-[65px] h-[54px]">
                <Skeleton className="w-8 h-6" />
                <Skeleton className="w-10 h-4 mt-1" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5 max-h-[40px] overflow-hidden">
              <Skeleton className="w-16 h-6" />
              <Skeleton className="w-16 h-6" />
              <Skeleton className="w-16 h-6" />
            </div>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-6" />
                <div className="w-0.5 h-[18px] bg-neutral-100" />
                <Skeleton className="w-8 h-6" />
              </div>
              <Skeleton className="w-20 h-6 ml-4" />
            </div>
          </div>
        </li>
      </div>
    </Default>
    <Mobile>
      <li className="border-b border-neutral-100 mx-5 px-5 py-4">
        <div className="block">
          <div className="flex items-start mb-3 max-h-[19px]">
            <Skeleton className="w-4 h-6 mr-[2px]" />
            <Skeleton className="w-3/4 h-6" />
          </div>
          <div className="flex placeholder:mt-2 text-neutral-700 mb-3" data-color-mode="light">
            <div className="flex-grow">
              <Skeleton className="w-full h-[42px]" />
            </div>
            <div className="flex flex-col items-center justify-center ml-2 p-1 border rounded-md text-center min-w-[48px] h-[42px]">
              <Skeleton className="w-8 h-6" />
              <Skeleton className="w-10 h-4 mt-1" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[26px]">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="bg-neutral-50 px-2 py-1 rounded w-16 h-6" />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-6" />
              <div className="w-0.5 h-[18px] bg-neutral-100" />
              <Skeleton className="w-8 h-6" />
            </div>
            <Skeleton className="w-20 h-6 ml-4" />
          </div>
        </div>
      </li>
    </Mobile>
  </>
);

const QnaPaginationSkelton = () => (
  <div className="flex justify-center items-center mt-4 space-x-2 gap-4 mb-2">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="w-8 h-8 rounded bg-neutral-100 flex justify-center items-center"></div>
    ))}
  </div>
);

const QnaPostsSkeleton = () => {
  return (
    <>
      <Default>
        <div className="w-[1204px] mx-auto p-4">
          <ul className="flex flex-col">
            {[...Array(5)].map((_, index) => (
              <QnaPostItemSkeleton key={index} />
            ))}
          </ul>
          <QnaPaginationSkelton />
        </div>
      </Default>
      <Mobile>
        <div className="min-w-[335px] mx-auto px-4">
          <ul className="flex flex-col">
            {[...Array(5)].map((_, index) => (
              <QnaPostItemSkeleton key={index} />
            ))}
          </ul>
          <QnaPaginationSkelton />
        </div>
      </Mobile>
    </>
  );
};

export default memo(QnaPostsSkeleton);
