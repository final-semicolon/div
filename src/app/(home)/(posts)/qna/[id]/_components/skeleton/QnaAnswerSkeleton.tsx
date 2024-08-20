import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

const QnaAnswerSkeleton = () => (
  <div className="border rounded-xl px-4 py-10">
    <div className="flex items-start mb-10 ">
      <Skeleton className="w-full h-10" />
    </div>
    <div className="flex flex-col   placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
      <Skeleton className="w-full h-28 rounded-2xl" />
    </div>
    <div className="flex flex-col  placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
      <Skeleton className="w-full h-48 rounded-2xl" />
    </div>
    <div className="flex flex-wrap gap-1.5 mb-5 max-h-[40px] overflow-hidden">
      <Skeleton className="w-16 h-6" />
      <Skeleton className="w-16 h-6" />
      <Skeleton className="w-16 h-6" />
    </div>
  </div>
);

export default memo(QnaAnswerSkeleton);
