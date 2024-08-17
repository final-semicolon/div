import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

const QnaReplySkeleton = () => (
  <div className="block">
    <div className="flex flex-col border-b-2 text-neutral-700 " data-color-mode="light">
      <Skeleton className="w-full h-[206px]" />
    </div>
  </div>
);

export default memo(QnaReplySkeleton);
