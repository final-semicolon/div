'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import ArchiveBannerOne from '../../../../../../public/images/archive/archive_banner_1.png';
import ArchiveBannerTwo from '../../../../../../public/images/archive/archive_banner_2.png';
import MobileArchiveBannerOne from '../../../../../../public/images/archive/LibraryPostbanner1.webp';
import MobileArchiveBannerTwo from '../../../../../../public/images/archive/LibraryPostbanner2.webp';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const ArchiveBanner = () => {
  return (
    <>
      <Default>
        <div className="flex items-center w-[1204px] mb-[60px]">
          <div className="w-[620px] h-[538px] mr-[60px]">
            <Image
              src={ArchiveBannerOne}
              alt="Archive Banner 1"
              priority
              placeholder="blur"
              width={620}
              height={538}
              loading="eager"
            />
          </div>
          <div className="w-[524px] h-[538px]">
            <Image
              src={ArchiveBannerTwo}
              alt="Archive Banner 2"
              priority
              placeholder="blur"
              width={524}
              height={538}
              loading="eager"
            />
          </div>
        </div>
      </Default>
      <Mobile>
        <div className="flex items-center w-full mb-[80px]">
          <Swiper slidesPerView={1.1} spaceBetween={8} loop={false} centeredSlides={true} className="ArchiveSwiper">
            {/* <div className="w-[335px] h-[263px]"> */}
            <SwiperSlide>
              <Image
                src={MobileArchiveBannerOne}
                alt="Archive Banner 1"
                priority
                placeholder="blur"
                width={335}
                height={263}
                loading="eager"
              />
            </SwiperSlide>
            {/* </div> */}
            <SwiperSlide>
              {/* <div className="w-[335px] h-[263px]"> */}
              <Image
                src={MobileArchiveBannerTwo}
                alt="Archive Banner 2"
                priority
                placeholder="blur"
                width={335}
                height={263}
                loading="eager"
              />
              {/* </div> */}
            </SwiperSlide>
          </Swiper>
        </div>
      </Mobile>
    </>
  );
};

export default ArchiveBanner;
