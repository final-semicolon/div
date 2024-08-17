'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { tagList } from './_tag-list/TagList';
import Link from 'next/link';
import Image from 'next/image';
import Pc from '@/assets/images/main-page_image/Pc';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import CarouselLeftHover from '@/assets/images/common/CarouselLeftHover';
import CarouselLeft from '@/assets/images/common/CarouselLeft';
import CarouselRightHover from '@/assets/images/common/CarouselRightHover';
import CarouselRight from '@/assets/images/common/CarouselRight';
import { useQuery } from '@tanstack/react-query';
import Left from '@/assets/images/common/Left';
import LeftButton from '@/assets/images/qna/LeftButton';
import LeftIcon from '@/assets/images/common/LeftIcon';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';

type TagType = {
  tag: string;
};

const MainPageTag = () => {
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

  const { data: tagListCount } = useQuery<TagType[]>({
    queryKey: ['tagList'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/main-page/tag-list');
        const data = await response.json();
        return data;
      } catch (error) {}
    }
  });

  const postTagCount = Object.values(tagListCount || {}).reduce(
    (allNames: { [key: string]: number }, person: TagType) => {
      const tagName = person.tag;
      if (!allNames) {
        allNames = {};
      }
      if (tagName in allNames) {
        allNames[tagName]++;
      } else {
        allNames[tagName] = 1;
      }
      return allNames;
    },
    {}
  );

  const handlePrevClick = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const handleNextClick = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start mb-5">
        <h1 className="text-h4 font-bold mb-5 text-neutral-900 ">태그로 간편하게 검색해 보세요!</h1>
        <Pc />
      </div>
      <div>
        <Swiper
          onSwiper={setSwiperInstance}
          loop={true}
          modules={[Navigation]}
          slidesPerView={5}
          spaceBetween={20}
          className="mySwiper"
        >
          {tagList.map((tag, index) => (
            <SwiperSlide key={index}>
              <div className="h-[224px] mb-[76px] ">
                <Link href={`/search?searchType=tag&keyword=${tag.tag}`}>
                  <div className="bg-sub-50 p-5 rounded-t-2xl flex justify-center items-center ">
                    <Image src={tag.img} alt="tagList" width={88} height={88} className="w-[88px] h-[88px]" />
                  </div>
                  <div className="bg-sub-100 h-[96px] rounded-b-2xl flex flex-col justify-center gap-2 pl-4">
                    <p className="text-subtitle1 font-bold text-neutral-900">#{tag.tagName}</p>
                    <p className="text-body1 font-regular text-neutral-800">
                      전체 게시글 {postTagCount[tag.tagName] || 0}
                    </p>
                  </div>
                </Link>
              </div>
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
    </div>
  );
};

export default MainPageTag;
