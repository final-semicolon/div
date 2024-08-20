import { Skeleton } from '@/components/ui/skeleton';

const ForumDetailSkeleton = () => {
  return (
    <div className="mb-5 mt-5">
      {[...Array(5)].map((_, index) => (
        <div className="mt-5 min-h-12" key={index}>
          <Skeleton className="w-full h-[200px]" />
        </div>
      ))}
    </div>
  );
};

export default ForumDetailSkeleton;
