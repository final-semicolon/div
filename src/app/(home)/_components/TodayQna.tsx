'use client';
import { Tables } from '@/types/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import qnaImage from '/public/images/mainPageImages/qnaImage.webp';
import Link from 'next/link';
import Image from 'next/image';
import Cap from '@/assets/images/main-page_image/qnaicom/Cap';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import CarouselLeftHover from '@/assets/images/common/CarouselLeftHover';
import CarouselLeft from '@/assets/images/common/CarouselLeft';
import CarouselRightHover from '@/assets/images/common/CarouselRightHover';
import CarouselRight from '@/assets/images/common/CarouselRight';
import { useQuery } from '@tanstack/react-query';
import { cutText, filterSlang } from '@/utils/markdownCut';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import LeftIcon from '@/assets/images/common/LeftIcon';

const TodayQna = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHoveringPrev, setIsHoveringPrev] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);

  useEffect(() => {
    if (swiperInstance) {
      const handleSlideChange = () => {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
        setIsHoveringPrev(false);
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

  const { data: todayQna } = useQuery<Tables<'qna_posts'>[]>({
    queryKey: ['todayQna'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/main-page/today-qna');
        const data = await response.json();
        return data;
      } catch (error) {}
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-start gap-1">
        <p className="text-h4 font-bold mb-5 text-neutral-900">방금 올라온 질문이에요! 지식을 공유하러 가볼까요?</p>
        <Cap />
      </div>
      <div className="relative h-[214px]">
        <Swiper
          onSwiper={setSwiperInstance}
          loop={true}
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={20}
          className="mySwiper"
        >
          {todayQna?.map((post) => (
            <SwiperSlide key={post.id}>
              <Link href={`/qna/${post.id}`}>
                <div className=" flex flex-col gap-2  rounded-2xl h-[214px] p-4 bg-sub-50">
                  <div className="flex flex-col justify-start gap-4 items-start">
                    <Image src={qnaImage} alt="iconList" width={67} height={64} />
                    <p className="text-subtitle1 font-medium text-neutral-300">오늘의 질문</p>
                    <p className="text-body1 font-medium text-neutral-900 text-wrap break-all ">
                      {cutText(filterSlang(post.title), 70)}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {!isBeginning && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 flex justify-center items-center w-[52px] h-[52px] left-[-26px] shadow-button  bg-neutral-50 hover:bg-neutral-100 rounded-full  z-50"
            onClick={handlePrevClick}
            onMouseEnter={() => setIsHoveringPrev(true)}
            onMouseLeave={() => setIsHoveringPrev(false)}
          >
            {isHoveringNext ? <LeftIconHover /> : <LeftIcon />}
          </div>
        )}
        {!isEnd && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 flex justify-center items-center w-[52px] h-[52px] right-[-26px] shadow-button  bg-neutral-50 hover:bg-neutral-100 rounded-full  z-50"
            onClick={handleNextClick}
            onMouseEnter={() => setIsHoveringNext(true)}
            onMouseLeave={() => setIsHoveringNext(false)}
          >
            {isHoveringNext ? <RightIconHover /> : <RightIcon />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayQna;
