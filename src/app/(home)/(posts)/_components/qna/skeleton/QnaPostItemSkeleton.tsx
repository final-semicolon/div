import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

const QnaPostItemSkeleton = () => (
  <li className="border-b border-neutral-100 p-5">
    <div className="block">
      <div className="flex items-start mb-5 max-h-[27px]">
        <Skeleton className="w-6 h-6 mr-[2px]" />
        <Skeleton className="w-3/4 h-6" />
      </div>
      <div className="flex placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
        <div className="flex-grow">
          <Skeleton className="w-full h-24" />
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
);

export default memo(QnaPostItemSkeleton);
