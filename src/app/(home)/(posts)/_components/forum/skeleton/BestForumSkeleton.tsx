import { Skeleton } from '@/components/ui/skeleton';

const BestForumSkeleton = () => {
  return (
    <div className="sticky top-10">
      <div className="border rounded-2xl px-6 py-5 min-w-80 max-w-80 min-h-[291px] max-h-[291px] border-neutral-100">
        <div className="flex items-center justify-between  border-b-2 mb-5">
          <div className="flex items-center font-bold text-body1 border-neutral-200">
            <Skeleton className="w-[24px] h-[24px] mr-2" />
            <Skeleton className="w-[100px] h-[20px]" />
          </div>
          <Skeleton className="w-[24px] h-[24px]" />
        </div>
        <div className="mb-5">
          {[...Array(3)].map((_, index) => (
            <div className="mt-5 min-h-12" key={index}>
              <Skeleton className="w-full h-[20px] mb-2" />
              <Skeleton className="w-[80%] h-[20px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestForumSkeleton;
