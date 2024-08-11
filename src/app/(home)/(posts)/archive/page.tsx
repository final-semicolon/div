import Image from 'next/image';
import ArchivePosts from '../_components/archive/ArchivePosts';
import PopularArchiveSwiper from '../_components/archive/PopularArchiveSwiper';
import ArchiveBannerOne from '../../../../../public/images/archive/archive_banner_1.png';
import ArchiveBannerTwo from '../../../../../public/images/archive/archive_banner_2.png';
import ScrollToTopButton from '../_components/forum/ScrollToTopButton';

const ArchivePage = () => {
  return (
    <div className="w-[1204px]">
      <div className="flex items-center w-[1204px] mb-[60px]">
        <div className="w-[620px] h-[538px] mr-[60px]">
          <Image src={ArchiveBannerOne} alt="Archive Banner 1" objectFit="cover" width={2480} height={2152} />
        </div>
        <div className="w-[524px] h-[538px]">
          <Image src={ArchiveBannerTwo} alt="Archive Banner 2" objectFit="cover" width={2096} height={2152} />
        </div>
      </div>
      <div className="flex flex-col justify- items-center relative mb-8">
        <div className="self-stretch flex-grow-0 flex-shrink-0 text-h3 font-bold text-center mt-[60px] text-neutral-900">
          유저들은 어떤 코드를 기록했을까요?
        </div>
        <div className="self-stretch flex-grow-0 flex-shrink-0 text-h4 font-regular text-center mt-3 text-neutral-400">
          지금 인기 코드를 확인해 보세요
        </div>
        <div className="w-full mt-[60px]">
          <PopularArchiveSwiper />
        </div>
      </div>
      <div className="w-full mt-[120px]">
        <ArchivePosts />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default ArchivePage;
