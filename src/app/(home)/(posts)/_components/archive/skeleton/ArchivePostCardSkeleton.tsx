import { Skeleton } from '@/components/ui/skeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const ArchivePostCardSkeleton = () => {
  return (
    <>
      <Default>
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
      </Default>
      <Mobile>
        <div className="flex flex-col justify-start items-start w-[264px] h-[280px] relative rounded-xl bg-white">
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl">
            <Skeleton className="w-[264px] h-[171px] object-cover rounded-xl" />
            <div className="absolute top-4 right-4">
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start self-stretch relative h-[109px]">
            <Skeleton className="w-3/4 h-6 mx-5 mt-3 mb-2" />
            <Skeleton className="w-1/2 h-5 mx-5 mb-2" />
            <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap h-[26px] overflow-hidden mx-5 mb-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="bg-neutral-50 w-12 h-5 rounded mr-2" />
              ))}
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default ArchivePostCardSkeleton;
