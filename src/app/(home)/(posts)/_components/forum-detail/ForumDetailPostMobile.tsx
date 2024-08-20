'use client';

import { forumDetailType } from '@/types/posts/forumDetailTypes';
import { timeForToday } from '@/utils/timeForToday';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import LikeButton from '@/components/common/LikeButton';
import BookmarkButton from '@/components/common/BookmarkButton';
import Share from '@/assets/images/common/Share';
import { useAuth } from '@/context/auth.context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { filterSlang } from '@/utils/markdownCut';
import TagBlock from '@/components/common/TagBlock';
import { handleLinkCopy } from '@/utils/handleLinkCopy';
import { POST_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { Mobile } from '@/hooks/common/useMediaQuery';
import KebabWhite from '@/assets/images/common/KebabWhite';
import MobileBackClickWhite from '@/components/common/MobileBackClickWhite ';
import MobileBackClickBlack from '@/components/common/MobileBackClickBlack';
import KebabButton from '@/assets/images/common/KebabButton';
import { toast } from 'react-toastify';
import { POST_DELETE_ALERT_TEXT } from '@/constants/alert';
import { useQueryClient } from '@tanstack/react-query';

const ForumDetailPostMobile = ({ forumDetail }: { forumDetail: forumDetailType[] }) => {
  const { me } = useAuth();
  const param = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [kebobToggle, setKebobToggle] = useState<boolean>(false);
  const [retouchPostModal, setRetouchPostModal] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const handlePostDelete = async () => {
    await fetch(`/api/posts/forum-detail/${param.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: me?.id })
    });
    await queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
    router.push('/forum');

    toast.success(POST_DELETE_ALERT_TEXT);
    return;
  };

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

  const handlePostRetouch = () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/edit/${param.id}?category=forum`);
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 relative">
      <Mobile>
        {forumDetail?.map((post) => (
          <div key={post.id} className="w-full flex flex-col ">
            <div
              className={`flex flex-col justify-between  h-[250px] w-full bg-cover p-5  ${post.thumbnail ? 'none' : 'bg-sub-200'} `}
              style={
                post.thumbnail
                  ? {
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0)), url(${post.thumbnail})`
                    }
                  : {}
              }
            >
              {scroll && <div className="h-[52px] w-full"></div>}
              <div
                className={`flex justify-between items-center  ${scroll ? 'bg-white px-5 py-2  fixed top-0 left-0  w-full' : 'bg-none '} `}
              >
                {scroll ? <MobileBackClickBlack /> : <MobileBackClickWhite />}
                {post.user_id === me?.id && (
                  <div className="relative">
                    <div className="p-2 md:p-4" onClick={() => setKebobToggle(!kebobToggle)}>
                      {scroll ? <KebabButton /> : <KebabWhite />}
                    </div>
                    {kebobToggle ? (
                      <div className="w-[82px] right-0 absolute flex flex-col justify-center text-body4 font-regular bg-white z-50 items-center shadow-lg border rounded-lg ">
                        <button
                          className="h-[36px] w-full rounded-t-lg hover:bg-main-50 hover:text-main-400 "
                          onClick={handlePostRetouch}
                        >
                          게시글 수정
                        </button>
                        <button
                          className="h-[36px]  w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                          onClick={() => setRetouchPostModal(true)}
                        >
                          게시글 삭제
                        </button>
                        {retouchPostModal && (
                          <ConfirmModal
                            isOpen={retouchPostModal}
                            onClose={() => setRetouchPostModal(false)}
                            onConfirm={handlePostDelete}
                            message={POST_DELETE_CONFIRM_TEXT}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-start items-start gap-4">
                <p className="text-subtitle1 font-bold text-white h-12  ">{filterSlang(post.title)}</p>
                <div className="flex  items-center gap-3 ">
                  <Image
                    src={post.user.profile_image}
                    alt="forumUserImage"
                    width={50}
                    height={50}
                    className="rounded-full w-[36px] h-[36px] "
                  />
                  <div className=" flex flex-col gap-1">
                    <p className="text-subtitle1 font-medium text-white">{post.user.nickname}</p>
                    <div className=" flex justify-start items-center gap-2">
                      <p className="text-body2 font-regular text-neutral-100">{post.forum_category}</p>
                      <p className="text-neutral-100">•</p>
                      <p className="text-body2 font-regular text-neutral-100">
                        {timeForToday(post.updated_at ? post.updated_at : post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5  whitespace-pre-wrap break-words m-5  border-b-[1px]">
              <MDEditor.Markdown source={filterSlang(post.content)} className="text-body3 font-regular" />

              <div className={`flex justify-start items-start gap-[6px]${post.tags === null ? ' block' : ' hidden'} `}>
                {post.tags?.map((tag) => <div key={tag.id}>{tag && <TagBlock tag={tag.tag} />}</div>)}
              </div>
              <p className="text-body3 font-regular text-neutral-400">
                {post.created_at.slice(0, 10).replace(/-/g, '.')}
              </p>
              <div className="flex justify-between items-center mb-5">
                <div className="flex gap-3">
                  <LikeButton id={post.id} type="forum" />
                  <BookmarkButton id={post.id} type="forum" />
                  <button
                    type="button"
                    onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${post.id}`)}
                  >
                    <Share />
                  </button>
                </div>
                <p className="text-body3 font-medium text-main-400"> {post.comment[0].count}개의 댓글</p>
              </div>
            </div>
          </div>
        ))}
      </Mobile>
    </div>
  );
};

export default ForumDetailPostMobile;
