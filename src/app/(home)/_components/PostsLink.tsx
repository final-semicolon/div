'use client';
import Link from 'next/link';
import qna from '@/assets/images/main-page_image/posts-list/qnaPostsLinkImage.svg';
import forum from '@/assets/images/main-page_image/posts-list/forumPostsLinkImage.svg';
import library from '@/assets/images/main-page_image/posts-list/libraryPostsLinkImage.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import Image from 'next/image';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import LeftIcon from '@/assets/images/common/LeftIcon';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';

const PostsLink = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);

  useEffect(() => {
    if (swiperInstance) {
      const handleSlideChange = () => {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
        setIsHoveringNext(false);
      };

      swiperInstance.on('slideChange', handleSlideChange);
      handleSlideChange();

      return () => {
        swiperInstance.off('slideChange', handleSlideChange);
      };
    }
  }, [swiperInstance]);

  const handlePrevClick = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const handleNextClick = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  return (
    <div className=" relative flex justify-between items-center gap-5 mt-5">
      <Swiper
        onSwiper={setSwiperInstance}
        slidesPerView={1}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false
        }}
        loop={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link href={'/qna'}>
            <Image
              src={qna}
              alt="Q&A 게시판"
              priority={true}
              loading="eager"
              width={1500}
              height={500}
              className="w-[1204px] h-[234px]"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Link href={'/forum'}>
            <Image src={forum} alt="Q&A 게시판" width={1500} height={500} className="w-[1204px] h-[234px]" />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Link href={'/archive'}>
            <Image src={library} alt="Q&A 게시판" width={1500} height={500} className="w-[1204px] h-[234px]" />
          </Link>
        </SwiperSlide>
      </Swiper>
      {!isBeginning && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 flex justify-center items-center w-[52px] h-[52px] left-[-26px] shadow-button  bg-neutral-50 hover:bg-neutral-100 rounded-full  z-50"
          onClick={handlePrevClick}
        >
          {isHoveringNext ? <LeftIconHover /> : <LeftIcon />}
        </div>
      )}
      {!isEnd && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 flex justify-center items-center w-[52px] h-[52px] right-[-26px] shadow-button  bg-neutral-50 hover:bg-neutral-100 rounded-full  z-50"
          onClick={handleNextClick}
        >
          {isHoveringNext ? <RightIconHover /> : <RightIcon />}
        </div>
      )}
    </div>
  );
};

export default PostsLink;
