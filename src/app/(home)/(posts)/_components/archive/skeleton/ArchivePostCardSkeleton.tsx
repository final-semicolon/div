import { Skeleton } from '@/components/ui/skeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const ArchivePostCardSkeleton = ({ width, height }: { width: number; height: number }) => {
  return (
    <>
      <Default>
        <div
          className="flex flex-col justify-start items-start relative rounded-xl bg-neutral-100"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl mb-2">
            <Skeleton
              className="object-cover rounded-xl"
              style={{ width: `${width}px`, height: `${(height / 414) * 280}px` }}
            />
          </div>
          <div
            className="flex flex-col justify-center items-start self-stretch relative"
            style={{ height: `${(height / 414) * 126}px` }}
          >
            <Skeleton className="mx-5 my-2" style={{ width: `${(width * 3) / 4}px`, height: '24px' }} />
            <Skeleton className="mx-5 mb-2" style={{ width: `${(width * 1) / 2}px`, height: '20px' }} />
          </div>
          <div
            className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap overflow-hidden mx-5 mb-2"
            style={{ height: `${(height / 414) * 46}px` }}
          >
            {[...Array(2)].map((_, index) => (
              <Skeleton
                key={index}
                className="bg-neutral-50 px-3 py-1 rounded my-2 mr-2"
                style={{ width: '64px', height: '24px' }}
              />
            ))}
          </div>
        </div>
      </Default>
      <Mobile>
        <div
          className="flex flex-col justify-start items-start relative rounded-xl bg-white"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl">
            <Skeleton
              className="object-cover rounded-xl"
              style={{ width: `${width}px`, height: `${(height / 280) * 171}px` }}
            />
            <div className="absolute top-4 right-4">
              <Skeleton className="rounded-full" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div
            className="flex flex-col justify-center items-start self-stretch relative"
            style={{ height: `${(height / 280) * 109}px` }}
          >
            <Skeleton className="mx-5 mt-3 mb-2" style={{ width: `${(width * 3) / 4}px`, height: '24px' }} />
            <Skeleton className="mx-5 mb-2" style={{ width: `${(width * 1) / 2}px`, height: '20px' }} />
            <div
              className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap overflow-hidden mx-5 mb-2"
              style={{ height: `${(height / 280) * 26}px` }}
            >
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="bg-neutral-50 rounded mr-2"
                  style={{ width: '48px', height: '20px' }}
                />
              ))}
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default ArchivePostCardSkeleton;
