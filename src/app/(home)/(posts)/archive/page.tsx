import Image from 'next/image';
// import ArchivePosts from '../_components/archive/ArchivePosts';
// import PopularArchiveSwiper from '../_components/archive/PopularArchiveSwiper';
// import ScrollToTopButton from '../_components/forum/ScrollToTopButton';

import dynamic from 'next/dynamic';
import ArchiveBanner from '../_components/archive/ArchiveBanner';

const PopularArchiveSwiper = dynamic(() => import('../_components/archive/PopularArchiveSwiper'));
const ArchivePosts = dynamic(() => import('../_components/archive/ArchivePosts'));
const ScrollToTopButton = dynamic(() => import('../_components/forum/ScrollToTopButton'));

const ArchivePage = () => {
  return (
    <div className="md:w-[1204px] ">
      <ArchiveBanner />
      <div className="flex flex-col justify- items-center relative mb-8">
        <div className="self-stretch flex-grow-0 flex-shrink-0 text-subtitle2 md:text-h3 font-bold text-center mt-10 md:mt-[60px] text-neutral-900">
          유저들은 어떤 코드를 기록했을까요?
        </div>
        <div className="self-stretch flex-grow-0 flex-shrink-0 text-body1 md:text-h4 font-regular text-center mt-1 md:mt-3 text-neutral-400">
          지금 인기 코드글을 확인해보세요!
        </div>
        <div className="w-full mt-10 md:mt-[60px]">
          <PopularArchiveSwiper />
        </div>
      </div>
      <div className="w-full mt-[120px] md:mt-[180px]">
        <ArchivePosts />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default ArchivePage;
