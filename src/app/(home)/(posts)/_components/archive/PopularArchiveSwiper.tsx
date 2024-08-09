'use client';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { usePopularArchivePosts } from '@/hooks/archive/useFetchArchivePosts';
import { Post } from '@/types/posts/archiveTypes';
import Image from 'next/image';
import BookmarkButton from '@/components/common/BookmarkButton';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import CarouselLeftHover from '@/assets/images/common/CarouselLeftHover';
import CarouselLeft from '@/assets/images/common/CarouselLeft';
import CarouselRightHover from '@/assets/images/common/CarouselRightHover';
import CarouselRight from '@/assets/images/common/CarouselRight';
import { useRouter } from 'next/navigation';
import { cutText } from '@/utils/markdownCut';
import DefaultThumbnail from '../../../../../../public/images/archive/default_thumbnail.png';

const PopularArchiveSwiper = () => {
  const { data, error, isLoading } = usePopularArchivePosts();
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHoveringPrev, setIsHoveringPrev] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);
  const router = useRouter();

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

  const handlePostClick = (id: string) => {
    router.push(`/archive/${id}`);
  };

  return (
    <div>
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={10}
        loop={false}
        className="ArchiveSwiper"
      >
        {data.data.map((post: Post) => (
          <SwiperSlide key={post.id}>
            <div
              className="flex flex-col justify-start items-start w-[388px] h-[414px] relative rounded-xl bg-white mb-[60px]"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl mb-2">
                <Image
                  src={post.thumbnail || DefaultThumbnail}
                  alt="Post Thumbnail"
                  width={1552}
                  height={1120}
                  className="w-[388px] h-[280px] object-cover rounded-xl"
                />
                <div className="absolute top-4 right-4">
                  <BookmarkButton id={post.id} type="archive" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start self-stretch relative h-[126px]">
                <div className="text-body1 font-bold text-neutral-900 mx-5 my-2">{cutText(post.title, 20)}</div>
                <div className="text-base text-body2 font-regular text-neutral-700 mx-5 mb-2">
                  {post.user.nickname
                    ? post.user.nickname.length > 20
                      ? `${post.user.nickname.slice(0, 20)}...`
                      : post.user.nickname
                    : 'unknown user'}
                </div>
              </div>
              <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap h-[46px] overflow-hidden mx-5 mb-2">
                {post.archive_tags && post.archive_tags.length > 0 ? (
                  post.archive_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-neutral-50 px-3 py-1 rounded text-base font-medium text-neutral-700 my-2 mr-2"
                      style={{ maxWidth: '100%' }}
                    >
                      #{tag.tag}
                    </span>
                  ))
                ) : (
                  <span className="h-[46px]"></span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {!isBeginning && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 left-[-24px] z-50"
          onClick={handlePrevClick}
          onMouseEnter={() => setIsHoveringPrev(true)}
          onMouseLeave={() => setIsHoveringPrev(false)}
        >
          <button className="swiper-button-prev-custom">
            {isHoveringPrev ? <CarouselLeftHover /> : <CarouselLeft />}
          </button>
        </div>
      )}
      {!isEnd && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 right-[-24px] z-50"
          onClick={handleNextClick}
          onMouseEnter={() => setIsHoveringNext(true)}
          onMouseLeave={() => setIsHoveringNext(false)}
        >
          <button className="swiper-button-prev-custom">
            {isHoveringNext ? <CarouselRightHover /> : <CarouselRight />}
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularArchiveSwiper;
