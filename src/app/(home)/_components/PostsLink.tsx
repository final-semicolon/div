'use client';
import Link from 'next/link';
import qna from '@/assets/images/main-page_image/posts-list/qnaPostsLinkImage.svg';
import forum from '@/assets/images/main-page_image/posts-list/forumPostsLinkImage.svg';
import library from '@/assets/images/main-page_image/posts-list/libraryPostsLinkImage.svg';
import mobilQna from '@/assets/images/main-page_image/posts-list/mobile/mobile-qna.svg';
import mobilForum from '@/assets/images/main-page_image/posts-list/mobile/mobile-forum.svg';
import mobilLibrary from '@/assets/images/main-page_image/posts-list/mobile/mobile-library.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import Image from 'next/image';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import LeftIcon from '@/assets/images/common/LeftIcon';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

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
    <>
      <Default>
        <div className=" relative flex justify-between items-center gap-5 mt-5  rounded-xl">
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
                  className="rounded-xl w-[1204px] h-[234px]"
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href={'/forum'}>
                <Image
                  src={forum}
                  alt="Q&A 게시판"
                  width={1500}
                  height={500}
                  className="rounded-xl w-[1204px] h-[234px]"
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href={'/archive'}>
                <Image
                  src={library}
                  alt="Q&A 게시판"
                  width={1500}
                  height={500}
                  className="rounded-xl w-[1204px] h-[234px]"
                />
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
      </Default>
      <Mobile>
        <div className="ml-5">
          <Swiper
            onSwiper={setSwiperInstance}
            slidesPerView={1.1}
            spaceBetween={8}
            modules={[Navigation, Autoplay, Pagination]}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false
            }}
            pagination={{
              el: '.custom-pagination',
              clickable: true
            }}
            loop={true}
            className="mySwiper"
          >
            <SwiperSlide>
              <Link href={'/qna'}>
                <Image
                  src={mobilQna}
                  alt="Q&A 게시판"
                  priority={true}
                  loading="eager"
                  width={500}
                  height={300}
                  className=" w-full h-[160px] object-cover rounded-2xl"
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href={'/forum'}>
                <Image
                  src={mobilForum}
                  alt="Q&A 게시판"
                  priority={true}
                  loading="eager"
                  width={500}
                  height={300}
                  className=" w-full  h-[160px] object-cover rounded-2xl "
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href={'/archive'}>
                <Image
                  src={mobilLibrary}
                  alt="Q&A 게시판"
                  priority={true}
                  loading="eager"
                  width={500}
                  height={300}
                  className=" w-full h-[160px] object-cover rounded-2xl"
                />
              </Link>
            </SwiperSlide>
          </Swiper>
          <div className="custom-pagination"></div>
        </div>
      </Mobile>
    </>
  );
};

export default PostsLink;
