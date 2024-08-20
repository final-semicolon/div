'use client';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { usePopularArchivePosts } from '@/hooks/archive/useFetchArchivePosts';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import SwiperNavigationButton from './SwiperNavigationButton';
import ArchivePostCard from './ArchivePostCard';
import PopularArchiveSwiperSkeleton from './skeleton/PopularArchiveSwiperSkeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const PopularArchiveSwiper = () => {
  const { data, error, isPending } = usePopularArchivePosts();
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

  if (isPending) {
    return (
      <>
        <Default>
          <PopularArchiveSwiperSkeleton width={388} height={414} />
        </Default>
        <Mobile>
          <PopularArchiveSwiperSkeleton width={264} height={280} />
        </Mobile>
      </>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data || !data.data) {
    return <div>No data available</div>;
  }

  return (
    <>
      <Default>
        <div className="relative">
          <Swiper
            onSwiper={setSwiperInstance}
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={10}
            loop={false}
            className="ArchiveSwiper"
          >
            {data.data.map((post) => (
              <SwiperSlide key={post.id}>
                <ArchivePostCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
          {!isBeginning && (
            <SwiperNavigationButton
              direction="prev"
              isHovering={isHoveringPrev}
              onClick={handlePrevClick}
              onMouseEnter={() => setIsHoveringPrev(true)}
              onMouseLeave={() => setIsHoveringPrev(false)}
            />
          )}
          {!isEnd && (
            <SwiperNavigationButton
              direction="next"
              isHovering={isHoveringNext}
              onClick={handleNextClick}
              onMouseEnter={() => setIsHoveringNext(true)}
              onMouseLeave={() => setIsHoveringNext(false)}
            />
          )}
        </div>
      </Default>
      <Mobile>
        <div className="relative">
          <Swiper slidesPerView={1.4} spaceBetween={8} centeredSlides={true} loop={false} className="ArchiveSwiper">
            {data.data.map((post) => (
              <SwiperSlide key={post.id}>
                <ArchivePostCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Mobile>
    </>
  );
};

export default PopularArchiveSwiper;
