'use client';

import CommentBubble from '@/assets/images/common/CommentBubble';
import Dot from '@/assets/images/common/Dot';
import Share from '@/assets/images/common/Share';
import BookmarkButton from '@/components/common/BookmarkButton';
import { filterSlang, markdownCutText, markdownFilterSlang } from '@/utils/markdownCut';
import { PostCardProps } from '@/types/posts/forumTypes';
import { timeForToday } from '@/utils/timeForToday';
import MDEditor from '@uiw/react-md-editor';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { handleLinkCopy } from '@/utils/handleLinkCopy';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/hooks/common/useDebounce';
import NewLikeButton from '@/components/common/NewLikeButton';

const removeImageLinks = (markdown: string) => {
  return markdown.replace(/!\[.*?\]\(.*?\)/g, '');
};

const PostCard = ({
  post,
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  onLike,
  onUnlike
}: PostCardProps & {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onUnlike: () => void;
}) => {
  const processedContent = removeImageLinks(post.content);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [lastAction, setLastAction] = useState<'like' | 'unlike' | null>(null);

  const debouncedLastAction = useDebounce(lastAction, 1000);

  useEffect(() => {
    if (debouncedLastAction === 'like') {
      onLike();
    } else if (debouncedLastAction === 'unlike') {
      onUnlike();
    }
  }, [debouncedLastAction, onLike, onUnlike]);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLike = useCallback(() => {
    if (isLiked) {
      setLikeCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      setLastAction('unlike');
    } else {
      setLikeCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      setLastAction('like');
    }
  }, [isLiked]);

  return (
    <div className="post-card max-w-[844px] mx-auto p-4 bg-white mb-1 border-b-2 border-b-neutral-50">
      <Link href={`/forum/${post.id}`}>
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[48px] gap-4 py-1 z-10">
          <div className="relative w-10 h-10 ">
            {post.user.profile_image && (
              <Image
                src={post.user.profile_image}
                alt="User Profile"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-1">
            <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
              <p className="flex-grow font-medium text-subtitle1 text-left text-neutral-900">{post.user.nickname}</p>
            </div>
            <div className="flex justify-start items-center self-stretch flex-grow relative gap-2">
              <p className="flex-grow-0 font-regular flex-shrink-0 text-body2 text-left text-neutral-300">
                {post.forum_category}
              </p>
              <Dot />
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                <p className="flex-grow-0 font-regular flex-shrink-0 text-body2 text-left text-neutral-300">
                  {timeForToday(post.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="post-image mt-2">
          {post.thumbnail && (
            <Image src={post.thumbnail} alt="Post Thumbnail" width={300} height={300} objectFit="cover" />
          )}
        </div>
        <h2 className="text-h4 font-bold text-neutral-900 mt-3">{filterSlang(post.title)}</h2>
        <div className="post-content mt-2 custom-markdown" data-color-mode="light">
          <MDEditor.Markdown source={markdownFilterSlang(markdownCutText(processedContent, 500))} />
        </div>

        <div className="post-tags mt-2">
          {post.forum_tags &&
            post.forum_tags.map((tag) => (
              <div
                key={tag.id}
                className="inline-block border bg-neutral-50 border-neutral-50 m-1 flex-wrap max-h-[40px] overflow-hidden"
              >
                <span
                  key={tag.id}
                  className="inline-block text-subtitle2 font-medium text-neutral-700 px-1 whitespace-nowrap "
                  style={{ maxWidth: '100%' }}
                >
                  #{tag.tag}
                </span>
              </div>
            ))}
        </div>
      </Link>
      <div className="flex items-center justify-between max-w-[844px] mx-auto">
        <div className="post-date mt-1 text-body1 text-neutral-400">{dayjs(post.created_at).format('YYYY-MM-DD')}</div>
        <div className="post-stats mt-2 flex items-center">
          <div className="flex items-center justify-center mr-2">
            <NewLikeButton isLiked={isLiked} likeCount={likeCount} onClick={handleLike} />
          </div>
          <div className="flex items-center justify-center mr-1">
            <BookmarkButton id={post.id} type="forum" />
          </div>
          <div className="flex items-center justify-center">
            <button onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${post.id}`)}>
              <Share />
            </button>
          </div>
          <span className="flex items-center justify-center ml-2">
            <CommentBubble />
            <span className="ml-1 text-subtitle1 font-medium text-neutral-400">
              {post.forum_comment[0]?.count || 0}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
