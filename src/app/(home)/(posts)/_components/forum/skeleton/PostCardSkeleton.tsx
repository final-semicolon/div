import { Skeleton } from '@/components/ui/skeleton';

const PostCardSkeleton = () => {
  return (
    <div className="post-card max-w-[844px] mx-auto p-4 bg-white mb-1 border-b-2 border-b-neutral-50">
      <div className="flex items-center">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <div className="ml-4">
          <Skeleton className="w-[150px] h-[20px]" />
          <Skeleton className="w-[100px] h-[16px] mt-2" />
        </div>
      </div>
      <Skeleton className="w-full h-[200px] mt-4" />
      <Skeleton className="w-[60%] h-[24px] mt-4" />
      <Skeleton className="w-[90%] h-[16px] mt-2" />
      <Skeleton className="w-[80%] h-[16px] mt-2" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="w-[80px] h-[24px]" />
        <div className="flex items-center">
          <Skeleton className="w-[24px] h-[24px] rounded-full" />
          <Skeleton className="w-[24px] h-[24px] rounded-full ml-4" />
          <Skeleton className="w-[24px] h-[24px] rounded-full ml-4" />
        </div>
      </div>
      <div className="post-tags mt-2 flex flex-wrap">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="w-[80px] h-[24px] m-1" />
        ))}
      </div>
    </div>
  );
};

export default PostCardSkeleton;
