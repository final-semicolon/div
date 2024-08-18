import { Skeleton } from '@/components/ui/skeleton';
import React, { memo } from 'react';

const QnaReplyFormSkeleton = () => (
  <div className="block">
    <div className="flex items-start mb-5 max-h-[27px]">
      <Skeleton className="w-full h-6" />
    </div>
    <div className="flex flex-col placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
      <Skeleton className="w-full h-36" />
    </div>
    <div className="flex gap-6 justify-end">
      <Skeleton className="w-[70px] h-12" />
      <Skeleton className="w-[70px] h-12" />
    </div>
  </div>
);

export default memo(QnaReplyFormSkeleton);
