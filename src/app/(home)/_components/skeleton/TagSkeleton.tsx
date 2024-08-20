import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TagSkeleton = () => {
  return (
    <div className="mb-5">
      <Skeleton className="w-1/2 h-[40px] mb-2" />
      <div className="mt-5 md:flex gap-5 hidden">
        <Skeleton className="w-1/2 md:w-1/5 h-[210px] mb-2" />
        <Skeleton className="w-1/2 md:w-1/5 h-[210px] mb-2" />
        <Skeleton className="w-1/5 h-[210px] mb-2 hidden md:block" />
        <Skeleton className="w-1/5 h-[210px] mb-2 hidden md:block" />
        <Skeleton className="w-1/5 h-[210px] mb-2 hidden md:block" />
      </div>
    </div>
  );
};

export default TagSkeleton;
