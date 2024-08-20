'use client';

import { timeForToday } from '@/utils/timeForToday';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import LikeButton from '@/components/common/LikeButton';
import BookmarkButton from '@/components/common/BookmarkButton';
import Share from '@/assets/images/common/Share';
import { useAuth } from '@/context/auth.context';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { archiveDetailType } from '@/types/posts/archiveDetailTypes';
import dayjs from 'dayjs';
import { filterSlang } from '@/utils/markdownCut';
import TagBlock from '@/components/common/TagBlock';
import { handleLinkCopy } from '@/utils/handleLinkCopy';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import BackClick from '@/components/common/BackClick';
import MobileBackClickBlack from '@/components/common/MobileBackClickBlack';
import MobileBackClickWhite from '@/components/common/MobileBackClickWhite ';
import KebabWhite from '@/assets/images/common/KebabWhite';

const ArchiveDetailPost = () => {
  const { me } = useAuth();
  const param = useParams();
  const router = useRouter();
  const [kebobToggle, setKebobToggle] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [archiveDetail, setArchiveDetail] = useState<archiveDetailType | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const fetchArchiveDetail = async () => {
      const response = await fetch(`/api/posts/archive-detail/${param.id}`);
      const data = await response.json();
      setArchiveDetail(data[0]);
      console.log(data[0]);

      setCommentCount(data.commentCount);
    };

    fetchArchiveDetail();
  }, [param.id]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handlePostDelete = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/archive-detail/${param.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: me?.id })
    });
    router.push('/archive');
    return;
  };

  const handlePostRetouch = () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/edit/${param.id}?category=archive`);
  };

  if (!archiveDetail) return <div></div>;
  const thumbnailsArray: string[] = archiveDetail.thumbnail ? archiveDetail.thumbnail.split(',') : [];
  return (
    <>
      <Default>
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-col gap-6 border-b-[1px] ">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {archiveDetail.user && (
                  <>
                    <Image
                      src={archiveDetail.user.profile_image}
                      alt="forumUserImage"
                      width={50}
                      height={50}
                      className="rounded-full w-[48px] h-[48px]"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-subtitle1 font-medium">{archiveDetail.user.nickname}</p>
                      <div className="flex justify-start items-center gap-2">
                        <p className="text-body2 font-regular text-neutral-300">
                          {timeForToday(archiveDetail.updated_at ? archiveDetail.updated_at : archiveDetail.created_at)}
                          <span>{archiveDetail.updated_at !== archiveDetail.created_at && '(수정됨)'}</span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {archiveDetail.user_id === me?.id && (
                <div className="relative">
                  <div className="p-4" onClick={() => setKebobToggle(!kebobToggle)}>
                    <KebabButton />
                  </div>
                  {kebobToggle && (
                    <div className="w-[105px] right-0 absolute flex flex-col justify-center items-center shadow-lg border rounded-lg">
                      <button
                        className="h-[44px] w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                        onClick={handlePostRetouch}
                      >
                        게시글 수정
                      </button>
                      <button
                        className="h-[44px] w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                        onClick={() => setConfirmModal(true)}
                      >
                        게시글 삭제
                      </button>
                    </div>
                  )}
                  {confirmModal && (
                    <div>
                      <ConfirmModal
                        isOpen={confirmModal}
                        onClose={() => setConfirmModal(false)}
                        onConfirm={handlePostDelete}
                        message={'게시글을 삭제하시겠습니까?'}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6 whitespace-pre-wrap break-words">
              <p className="text-h4 font-bold">{archiveDetail.title}</p>

              <MDEditor.Markdown source={filterSlang(archiveDetail.content)} className="text-body1 font-regular" />
            </div>
            <div className="flex justify-start items-start gap-2">
              {archiveDetail.tags?.map((tag) => <div key={tag.id}>{tag && <TagBlock tag={tag.tag} />}</div>)}
            </div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-body1 font-regular text-neutral-400">
                {dayjs(archiveDetail.created_at).format('YYYY.MM.DD')}
              </p>
              <div className="flex gap-5">
                <LikeButton id={archiveDetail.id} type="archive" />
                <BookmarkButton id={archiveDetail.id} type="archive" />
                <button
                  type="button"
                  onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/archive/${archiveDetail.id}`)}
                >
                  <Share />
                </button>
                <p className="text-subtitle1 font-medium text-main-400">{commentCount || 0}개의 댓글</p>
              </div>
            </div>
          </div>
        </div>
      </Default>
      <Mobile>
        <div className="flex flex-col gap-5 md:gap-6 relative">
          {thumbnailsArray.map((thumbnail: string | null, index: number) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between h-[250px] w-full bg-cover p-5 ${
                thumbnail ? '' : 'bg-sub-200'
              }`}
              style={
                thumbnail
                  ? {
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0)), url(${thumbnail})`
                    }
                  : {}
              }
            >
              {scroll && <div className="h-[52px] w-full"></div>}
              <div
                className={`flex justify-between items-center ${
                  scroll ? 'bg-white px-5 py-2 fixed top-0 left-0 w-full' : 'bg-none'
                }`}
              >
                {scroll ? <MobileBackClickBlack /> : <MobileBackClickWhite />}
                {archiveDetail.user_id === me?.id && (
                  <div className="relative">
                    <div className="p-4" onClick={() => setKebobToggle(!kebobToggle)}>
                      {scroll ? <KebabButton /> : <KebabWhite />}
                    </div>
                    {kebobToggle && (
                      <div className="w-[105px] right-0 absolute flex flex-col justify-center items-center bg-white z-50 shadow-lg border rounded-lg">
                        <button
                          className="h-[44px] w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                          onClick={handlePostRetouch}
                        >
                          게시글 수정
                        </button>
                        <button
                          className="h-[44px] w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                          onClick={() => setConfirmModal(true)}
                        >
                          게시글 삭제
                        </button>
                      </div>
                    )}
                    {confirmModal && (
                      <div>
                        <ConfirmModal
                          isOpen={confirmModal}
                          onClose={() => setConfirmModal(false)}
                          onConfirm={handlePostDelete}
                          message={'게시글을 삭제하시겠습니까?'}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute mt-20 left-0 z-10 p-4">
                <div className="flex flex-col justify-start items-start gap-4">
                  <p className="text-subtitle1 font-bold text-white h-12">{archiveDetail.title}</p>

                  {archiveDetail.user && (
                    <div className="flex  items-center gap-3 ">
                      <Image
                        src={archiveDetail.user.profile_image}
                        alt="forumUserImage"
                        width={36}
                        height={36}
                        className="rounded-full w-[36px] h-[36px]"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="subtitle1-medium-14px text-white ">{archiveDetail.user.nickname}</p>
                        <div className="flex justify-start items-center gap-2">
                          <p className="body4-regular-13px text-neutral-100">
                            {timeForToday(
                              archiveDetail.updated_at ? archiveDetail.updated_at : archiveDetail.created_at
                            )}
                            <span>{archiveDetail.updated_at !== archiveDetail.created_at && '(수정됨)'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div>
            <MDEditor.Markdown
              source={filterSlang(archiveDetail.content)}
              className="body3-regular-14px w-full"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <div className="flex justify-start items-start gap-2">
            {archiveDetail.tags?.map((tag) => <div key={tag.id}>{tag && <TagBlock tag={tag.tag} />}</div>)}
          </div>
          <div className="flex justify-start items-start gap-2">
            <p className="body3-regular-14px text-neutral-400">
              {dayjs(archiveDetail.created_at).format('YYYY.MM.DD')}
            </p>
          </div>
          <div className="w-[375px] mb-4 flex justify-between items-start">
            <div className="flex items-start gap-2">
              <LikeButton id={archiveDetail.id} type="archive" />
              <BookmarkButton id={archiveDetail.id} type="archive" />
              <button
                type="button"
                onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/archive/${archiveDetail.id}`)}
              >
                <Share />
              </button>
            </div>
            <div className="mr-[20px]">
              <p className="body3-medium-14px text-main-400 mr-6">{commentCount || 0}개의 댓글</p>
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default ArchiveDetailPost;
