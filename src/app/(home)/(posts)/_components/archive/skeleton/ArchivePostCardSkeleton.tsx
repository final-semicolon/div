import { Skeleton } from '@/components/ui/skeleton';

const ArchivePostCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-start items-start w-[388px] h-[414px] relative rounded-xl bg-neutral-100">
      <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl mb-2">
        <Skeleton className="w-[388px] h-[280px] object-cover rounded-xl" />
      </div>
      <div className="flex flex-col justify-center items-start self-stretch relative h-[126px]">
        <Skeleton className="mx-5 my-2 w-3/4 h-6" />
        <Skeleton className="mx-5 mb-2 w-1/2 h-5" />
      </div>
      <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap h-[46px] overflow-hidden mx-5 mb-2">
        {[...Array(2)].map((_, index) => (
          <Skeleton key={index} className="bg-neutral-50 px-3 py-1 rounded my-2 mr-2 w-16 h-6" />
        ))}
      </div>
    </div>
  );
};

export default ArchivePostCardSkeleton;
