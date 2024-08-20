import { Skeleton } from '@/components/ui/skeleton';

const MainForumSkeleton = () => {
  return (
    <div className="mb-5">
      <Skeleton className="w-1/2 h-[40px] mb-2" />
      <div className="mt-5 flex gap-5">
        <Skeleton className="w-full md:w-1/3 h-[570px] mb-2" />
        <Skeleton className="w-1/3 h-[570px] mb-2 hidden md:block" />
        <Skeleton className="w-1/3 h-[570px] mb-2 hidden md:block" />
      </div>
    </div>
  );
};

export default MainForumSkeleton;
