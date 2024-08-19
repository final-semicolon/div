import { Skeleton } from '@/components/ui/skeleton';
import React, { memo } from 'react';

const QnaReplyFormSkeleton = () => (
  <div className="mt-[21.5px] py-5 md:mt-0 md:py-6">
    <div className="flex flex-col placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
      <Skeleton className="w-full h-[116px] md:h-[176px]" />
    </div>
    <div className="flex gap-6 justify-end">
      <Skeleton className="w-[55px] h-[35px] md:w-[70px] md:h-12" />
      <Skeleton className="w-[55px] h-[35px] md:w-[70px] md:h-12" />
    </div>
  </div>
);

export default memo(QnaReplyFormSkeleton);
