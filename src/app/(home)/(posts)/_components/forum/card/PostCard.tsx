'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import MDEditor from '@uiw/react-md-editor';
import { debounce } from 'lodash';

import CommentBubble from '@/assets/images/common/CommentBubble';
import Share from '@/assets/images/common/Share';
import BookmarkButton from '@/components/common/BookmarkButton';
import NewLikeButton from '@/components/common/NewLikeButton';
import { filterSlang, markdownCutText, markdownFilterSlang, removeImageLinks } from '@/utils/markdownCut';
import { handleLinkCopy } from '@/utils/handleLinkCopy';
import { PostCardProps } from '@/types/posts/forumTypes';
import PostTags from './PostTags';
import PostHeader from './PostHeader';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

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

  const debouncedOnLike = useCallback(
    debounce(() => {
      if (lastAction === 'like') {
        onLike();
      } else if (lastAction === 'unlike') {
        onUnlike();
      }
    }, 1000),
    [lastAction, onLike, onUnlike]
  );

  useEffect(() => {
    if (lastAction) {
      debouncedOnLike();
    }
    return () => {
      debouncedOnLike.cancel();
    };
  }, [lastAction, debouncedOnLike]);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLike = useCallback(() => {
    setIsLiked((prevIsLiked) => {
      setLastAction(prevIsLiked ? 'unlike' : 'like');
      setLikeCount((prevCount) => prevCount + (prevIsLiked ? -1 : 1));
      return !prevIsLiked;
    });
  }, []);

  return (
    <>
      <Default>
        <div className="max-w-[844px] mx-auto p-4 bg-white mb-1 border-b-2 border-b-neutral-50">
          <Link href={`/forum/${post.id}`} rel="preload">
            <PostHeader post={post} />
            {post.thumbnail && (
              <div className="post-image mt-2">
                <Image src={post.thumbnail} alt="Post Thumbnail" width={300} height={300} objectFit="cover" />
              </div>
            )}
            <h2 className="text-h4 font-bold text-neutral-900 mt-3 line-clamp-1">{filterSlang(post.title)}</h2>
            <div className="post-content mt-2 custom-markdown" data-color-mode="light">
              <MDEditor.Markdown source={markdownFilterSlang(markdownCutText(processedContent, 500))} />
            </div>
            {post.forum_tags && <PostTags tags={post.forum_tags} />}
          </Link>
          <div className="flex items-center justify-between max-w-[844px] mx-auto">
            <div className="post-date mt-1 text-body1 text-neutral-400">
              {dayjs(post.created_at).format('YYYY-MM-DD')}
            </div>
            <div className="post-stats mt-2 flex items-center">
              <NewLikeButton isLiked={isLiked} likeCount={likeCount} onClick={handleLike} />
              <BookmarkButton id={post.id} type="forum" />
              <button onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${post.id}`)}>
                <Share />
              </button>
              <span className="flex items-center justify-center ml-2">
                <CommentBubble />
                <span className="ml-1 text-subtitle1 font-medium text-neutral-400">
                  {post.forum_comment[0]?.count || 0}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Default>
      <Mobile>
        <div className="max-w-[767px] mx-auto p-5 bg-white mb-1 border-b border-b-neutral-50">
          <Link href={`/forum/${post.id}`} rel="preload">
            <PostHeader post={post} />
            {post.thumbnail && (
              <div className="mt-2 w-full h-[446px]">
                <Image src={post.thumbnail} alt="Post Thumbnail" width={295} height={446} objectFit="cover" />
              </div>
            )}
            <h2 className="text-subtitle2 font-bold text-neutral-900 mt-5 line-clamp-1">{filterSlang(post.title)}</h2>
            <div className="post-content mt-6 custom-markdown" data-color-mode="light">
              <MDEditor.Markdown source={markdownFilterSlang(markdownCutText(processedContent, 500))} />
            </div>
            {post.forum_tags && <PostTags tags={post.forum_tags} />}
          </Link>
          <div className="post-date mt-1 text-caption font-regular text-neutral-400">
            {dayjs(post.created_at).format('YYYY-MM-DD')}
          </div>
          <div className="flex items-center justify-end max-w-[844px]">
            <div className="post-stats mt-2 flex items-center gap-3">
              <NewLikeButton isLiked={isLiked} likeCount={likeCount} onClick={handleLike} />
              <BookmarkButton id={post.id} type="forum" />
              <button onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/forum/${post.id}`)}>
                <Share />
              </button>
              <span className="flex items-center justify-center">
                <CommentBubble />
                <span className="ml-[2px] text-body3 font-medium text-neutral-400">
                  {post.forum_comment[0]?.count || 0}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default PostCard;
