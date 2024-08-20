'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { timeForToday } from '@/utils/timeForToday';
import Image from 'next/image';
import Share from '@/assets/images/common/Share';
import CommentBubble from '@/assets/images/common/CommentBubble';
import Star from '@/assets/images/main-page_image/Star';
import MDEditor from '@uiw/react-md-editor';
import { processMarkdown } from '@/utils/markdownCut';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import LikeButton from '@/components/common/LikeButton';
import TagBlock from '@/components/common/TagBlock';
import { BestForumType } from '@/types/mainpage';
import { useQuery } from '@tanstack/react-query';
import { handleLinkCopy } from '@/utils/handleLinkCopy';
import LeftIconHover from '@/assets/images/common/LeftIconHover';
import LeftIcon from '@/assets/images/common/LeftIcon';
import RightIconHover from '@/assets/images/common/RightIconHover';
import RightIcon from '@/assets/images/common/RightIcon';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import MainForumSkeleton from './skeleton/MainForumSkeleton';

const BestForum = () => {
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

  const { data: forumList, isPending } = useQuery<BestForumType[]>({
    queryKey: ['bestForum'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/main-page/best-forum');
        const data = await response.json();
        return data;
      } catch (error) {}
    }
  });

  if (isPending) {
    return <MainForumSkeleton />;
  }

  return (
    <div className="flex flex-col ml-5 md:ml-0 my-16 md:my-0">
      <div className="flex justify-start items-center mb-6 md:mb-8 gap-[6px]">
        <h1 className="md:text-h4 md:font-bold text-subtitle1 font-bold ">오늘의 인기 포럼이에요</h1>
        <Star />
      </div>
      <Default>
        <div className=" relative h-[570px] ">
          <Swiper
            onSwiper={setSwiperInstance}
            loop={true}
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={20}
            className="mySwiper"
          >
            {forumList?.map((forum) => (
              <SwiperSlide key={forum.id}>
                <div className="flex flex-col border rounded-xl gap-6 p-5 h-[570px]  ">
                  <div className="flex justify-start items-start gap-4  border-b-[1px] h-[68px]">
                    <Image
                      src={forum.users.profile_image}
                      alt="userImage"
                      width={60}
                      height={60}
                      className=" w-[48px] h-[48px] rounded-full"
                    />
                    <div className=" flex flex-col justify-start gap-1 ">
                      <h2>{forum.users.nickname}</h2>
                      <div className="flex justify-start items-center gap-1">
                        <p className="text-body font-regular text-neutral-300">{forum.forum_category}</p>
                        <span className="text-body font-regular text-neutral-300">▪</span>
                        <p className="text-body font-regular text-neutral-300">
                          {timeForToday(forum.updated_at ? forum.updated_at : forum.created_at)}
                          <span className="text-xs">{forum.updated_at !== forum.created_at && '(수정됨)'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/forum/${forum.id}`}>
                    <div className=" flex flex-col gap-2  ">
                      {forum.thumbnail ? (
                        <Image
                          src={forum.thumbnail}
                          alt="forumThumbnail"
                          width={348}
                          height={210}
                          className="w-[348px] h-[210px] object-cover "
                        />
                      ) : null}
                      <div
                        className={`flex flex-col ${forum.thumbnail ? 'h-[85px] overflow-hidden' : 'h-[250px]'} gap-2`}
                      >
                        <h1 className="text-h5 font-bold truncate ">{forum.title}</h1>
                        {forum.thumbnail ? (
                          <div className="text-body2 font-regular   ">
                            <MDEditor.Markdown source={processMarkdown(forum.content, 45)} />
                          </div>
                        ) : (
                          <div className="text-body2 font-regular  ">
                            <MDEditor.Markdown source={processMarkdown(forum.content, 200)} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-auto">
                    <div className="flex justify-start items-start h-[30px] gap-[6px] mb-6 ">
                      {forum.tags.map((tag) => (
                        <div key={tag.id}>{tag && <TagBlock tag={tag.tag} />}</div>
                      ))}
                    </div>
                    <div className=" flex flex-col gap-2">
                      <p className=" text-right text-body font-regular text-neutral-400 ">
                        {forum.created_at.slice(0, 10).replace(/-/g, '.')}
                      </p>
                      <div className="flex justify-between items-center ">
                        <div className="flex justify-start items-center gap-4">
                          <LikeButton id={forum.id} type="forum" />
                          <button
                            onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${forum.id}`)}
                          >
                            <Share />
                          </button>
                        </div>
                        <div className=" flex justify-start items-center gap-1">
                          <CommentBubble />
                          <p className="text-subtitle1 font-medium text-neutral-400">{forum.comments[0].count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
      </Default>
      <Mobile>
        <div className="h-[478px] ">
          <Swiper slidesPerView={1.1} spaceBetween={8} className="mySwiper">
            {forumList?.map((forum) => (
              <SwiperSlide key={forum.id}>
                <div className="flex flex-col border rounded-xl gap-6 p-5 h-[478px]  ">
                  <div className="flex justify-start items-start gap-3  border-b-[1px] h-[50px] pb-[10px]">
                    <Image
                      src={forum.users.profile_image}
                      alt="userImage"
                      width={60}
                      height={60}
                      className=" w-[36px] h-[36px] rounded-full"
                    />
                    <div className=" flex flex-col justify-start ">
                      <h2 className="text-subtitle3 font-medium text-neutral-900">{forum.users.nickname}</h2>
                      <div className="flex justify-start items-center gap-1">
                        <p className="text-body4 font-regular text-neutral-500">{forum.forum_category}</p>
                        <span className="text-body4 font-regular text-neutral-100">•</span>
                        <p className="text-body4 font-regular text-neutral-500">
                          {timeForToday(forum.updated_at ? forum.updated_at : forum.created_at)}
                          <span className="text-xs">{forum.updated_at !== forum.created_at && '(수정됨)'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/forum/${forum.id}`}>
                    <div className=" flex flex-col gap-2  ">
                      {forum.thumbnail ? (
                        <Image
                          src={forum.thumbnail}
                          alt="forumThumbnail"
                          width={348}
                          height={210}
                          className="w-[280px] h-[140px] object-cover "
                        />
                      ) : null}
                      <div
                        className={` flex flex-col ${forum.thumbnail ? 'h-[85px] overflow-hidden' : 'h-[220px]'} gap-2`}
                      >
                        <h1 className="text-subtitle2 font-bold truncate ">{forum.title}</h1>
                        {forum.thumbnail ? (
                          <div className="text-body3 font-regular  ">
                            <MDEditor.Markdown source={processMarkdown(forum.content, 45)} />
                          </div>
                        ) : (
                          <div className="text-body3 font-regular  ">
                            <MDEditor.Markdown source={processMarkdown(forum.content, 200)} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-auto">
                    <div className="flex justify-start items-start h-[30px] gap-[6px] mb-5 ">
                      {forum.tags.map((tag) => (
                        <div key={tag.id}>{tag && <TagBlock tag={tag.tag} />}</div>
                      ))}
                    </div>
                    <div className=" flex flex-col gap-2">
                      <p className=" text-right text-body font-regular text-neutral-400 ">
                        {forum.created_at.slice(0, 10).replace(/-/g, '.')}
                      </p>
                      <div className="flex justify-between items-center ">
                        <div className="flex justify-start items-center gap-4">
                          <LikeButton id={forum.id} type="forum" />
                          <button
                            onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${forum.id}`)}
                          >
                            <Share />
                          </button>
                        </div>
                        <div className=" flex justify-start items-center gap-1">
                          <CommentBubble />
                          <p className="text-subtitle1 font-medium text-neutral-400">{forum.comments[0].count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Mobile>
    </div>
  );
};

export default BestForum;
