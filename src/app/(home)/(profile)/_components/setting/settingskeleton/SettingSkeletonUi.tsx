import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import SettingItemSkeleton from './SettingItemSkeleton';

const SettingSkeletonUi = () => {
  const skeletonitem = Array.from({ length: 5 }, (_, index) => index);
  return (
    <div className="">
      <Default>
        <div className="mb-9">
          <p className="profile-skeleton w-[100px] h-[27px] mb-2" />
          <p className="profile-skeleton w-[300px] h-[25px]" />
        </div>
      </Default>
      <div className="md:border md:border-gray-200 md:rounded-3xl animate-pulse md:min-w-[608px] md:max-w-[748px]">
        <div className="center-alignment md:p-[20px_80px] p-5">
          <div className="w-[120px] h-[120px] border border-neutral-50 rounded-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
          <Default>
            <p className="profile-skeleton w-[250px] h-8 mt-2 mb-10" />
          </Default>
          <Mobile>
            <p className="profile-skeleton w-[150px] h-6 mt-5" />
            <p className="profile-skeleton w-[150px] h-6 mt-2 mb-10" />
          </Mobile>
          <div className="md:max-w-[588px] md:min-w-[500px] min-w-[335px]">
            {skeletonitem.map((_, index) => (
              <SettingItemSkeleton key={index} />
            ))}
            <p className="profile-skeleton w-full h-[120px] mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingSkeletonUi;
