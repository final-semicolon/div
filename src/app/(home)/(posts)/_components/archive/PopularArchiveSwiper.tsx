'use client';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { usePopularArchivePosts } from '@/hooks/archive/useFetchArchivePosts';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import SwiperNavigationButton from './SwiperNavigationButton';
import ArchivePostCard from './ArchivePostCard';

const PopularArchiveSwiper = () => {
  const { data, error, isLoading } = usePopularArchivePosts();
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data || !data.data) {
    return <div>No data available</div>;
  }

  return (
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
  );
};

export default PopularArchiveSwiper;
