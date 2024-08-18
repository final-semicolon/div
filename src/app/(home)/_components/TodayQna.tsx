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
import { useQuery } from '@tanstack/react-query';
import { cutText, filterSlang } from '@/utils/markdownCut';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import LeftIcon from '@/assets/images/common/LeftIcon';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const TodayQna = () => {
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
    <div className="flex flex-col md:ml-0 ml-5">
      <Default>
        <div className="flex justify-start gap-[6px] ">
          <p className="text-subtitle1 font-bold md:text-h4 mb-9 text-neutral-900">
            방금 올라온 질문이에요! 지식을 공유하러 가볼까요?
          </p>
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
                      <Image src={qnaImage} alt="iconList" width={67} height={64} className="w-[67px] h-[64px]" />
                      <p className="text-subtitle1 font-medium text-neutral-300">오늘의 질문</p>
                      <p className="text-body1 font-medium text-neutral-900 text-wrap break-all ">
                        {cutText(filterSlang(post.title), 45)}
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
        <div className=" flex flex-col mb-6">
          <div className="flex justify-start gap-[6px]">
            <p className="text-subtitle1 font-bold md:text-h4 text-neutral-900">방금 올라온 질문이에요!</p>
            <Cap />
          </div>
          <p className="text-subtitle3 font-medium">지식을 공유하러 가볼까요?</p>
        </div>
        <div className="relative w-full h-[178px]">
          <Swiper
            onSwiper={setSwiperInstance}
            loop={true}
            modules={[Navigation]}
            slidesPerView={1.1}
            spaceBetween={8}
            className="mySwiper"
          >
            {todayQna?.map((post) => (
              <SwiperSlide key={post.id}>
                <Link href={`/qna/${post.id}`}>
                  <div className="flex flex-col justify-start  rounded-2xl p-5 gap-4 items-start w-full [178px] bg-sub-50">
                    <Image src={qnaImage} alt="iconList" width={67} height={64} className="w-[67px] h-[64px]" />
                    <p className="text-subtitle3 font-medium text-neutral-500">오늘의 질문</p>
                    <p className="text-body2 font-regular text-neutral-900 truncate w-full ">{post.title}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Mobile>
    </div>
  );
};

export default TodayQna;
