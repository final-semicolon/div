import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import ArchivePostCardSkeleton from './ArchivePostCardSkeleton';

const ArchivePostsSkeleton = ({ width, height }: { width: number; height: number }) => {
  return (
    <>
      <Default>
        <>
          <div className="mb-9">
            <p className="text-subtitle1 text-neutral-400 font-medium mb-3">Level Up Course</p>
            <p className="text-h3 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
            <div className="flex items-center justify-between text-subtitle1 font-medium text-neutral-700 mt-6">
              <div className="flex items-center ">
                전체 게시글
                <p className="flex items-center text-subtitle1 font-bold text-neutral-800 ml-1">(로딩 중...)</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <ArchivePostCardSkeleton key={index} width={width} height={height} />
            ))}
          </div>
        </>
      </Default>
      <Mobile>
        <>
          <div className="mb-5 mx-5">
            <p className="text-subtitle3 text-neutral-400 font-medium mb-1">Level Up Course</p>
            <p className="text-subtitle2 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
            <div className="flex items-center justify-between text-subtitle3 font-medium text-neutral-700 mt-5">
              <div className="flex items-center ">
                전체 게시글
                <p className="flex items-center text-subtitle3 font-bold text-neutral-800 ml-1">(로딩중...)</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mx-5">
            {[...Array(5)].map((_, index) => (
              <ArchivePostCardSkeleton key={index} width={width} height={height} />
            ))}
          </div>
        </>
      </Mobile>
    </>
  );
};

export default ArchivePostsSkeleton;
