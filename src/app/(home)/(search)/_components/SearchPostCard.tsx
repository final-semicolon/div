import CommentBubble from '@/assets/images/common/CommentBubble';
import NewLikeButton from '@/components/common/NewLikeButton';
import useDebounce from '@/hooks/common/useDebounce';
import { SearchPost } from '@/types/search/SearchType';
import { cutText, markdownFilterSlang } from '@/utils/markdownCut';
import MDEditor from '@uiw/react-md-editor';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type SearchPostCardProps = {
  post: SearchPost;
  isLiked: boolean;
  currentUserId?: string;
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
};

const removeImageLinks = (markdown: string) => markdown.replace(/!\[.*?\]\(.*?\)/g, '');

const SearchPostCard = ({ post, isLiked: initialIsLiked, currentUserId, primaryCategory }: SearchPostCardProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [lastAction, setLastAction] = useState<'like' | 'unlike' | null>(null);

  const debouncedLastAction = useDebounce(lastAction, 1000);

  useEffect(() => {
    if (debouncedLastAction === 'like') {
      handleLike(post.id, post.category);
    } else if (debouncedLastAction === 'unlike') {
      handleUnlike(post.id, post.category);
    }
  }, [debouncedLastAction, post.id, post.category]);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleLike = useCallback(
    async (postId: string, type: 'archive' | 'forum' | 'qna') => {
      if (!currentUserId) return;
      try {
        const response = await fetch('/api/common/like/new-like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, userId: currentUserId, type })
        });
        if (!response.ok) throw new Error('Failed to like the post');
        const data = await response.json();
        console.log(`Liked post with ID: ${postId}`, data);
      } catch (error) {
        console.error(`Error liking post with ID: ${postId}`, error);
      }
    },
    [currentUserId]
  );

  const handleUnlike = useCallback(
    async (postId: string, type: 'archive' | 'forum' | 'qna') => {
      if (!currentUserId) return;
      try {
        const response = await fetch('/api/common/like/new-like', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, userId: currentUserId, type })
        });
        if (!response.ok) throw new Error('Failed to unlike the post');
        const data = await response.json();
        console.log(`Unliked post with ID: ${postId}`, data);
      } catch (error) {
        console.error(`Error unliking post with ID: ${postId}`, error);
      }
    },
    [currentUserId]
  );

  const handleOnLike = useCallback(() => {
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

  const handleLikeButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleOnLike();
    },
    [handleOnLike]
  );

  const processedContent = removeImageLinks(post.content);
  const formCategory = post.category === 'forum' ? post.forum_category : undefined;
  const tags = post.tag?.map((tag) => tag.tag) || [];

  return (
    <Link href={`/${post.category}/${post.id}`}>
      <div className="p-[20px_24px] w-full max-w-[335px] md:max-w-[592px] mx-auto md:h-[381px] h-auto border border-neutral-100 rounded-2xl flex flex-col">
        <div className="flex-1">
          <div className="mb-4 md:mb-5">
            <div className="flex items-center text-body3 md:text-body1 font-regular text-neutral-500">
              {primaryCategory === 'all' ? (
                <p> {post.category === 'qna' ? 'Q&A' : post.category === 'forum' ? '포럼' : '라이브러리'}</p>
              ) : (
                <p className="text-main-400">
                  {post.category === 'qna' ? 'Q&A' : post.category === 'forum' ? '포럼' : '라이브러리'}
                </p>
              )}
              {formCategory &&
                (primaryCategory === 'all' ? (
                  <span className="ml-1">
                    <span className="text-neutral-100">•</span> {formCategory}
                  </span>
                ) : (
                  <span className="ml-1 text-main-400">
                    <span className="text-neutral-100">•</span> {formCategory}
                  </span>
                ))}
            </div>
            <p className="text-body3 md:text-body1 font-bold text-neutral-800 line-clamp-1 ">
              {cutText(post.title, 45)}
            </p>
          </div>
          <div className="mb-4 md:mb-5 overflow-hidden break-words whitespace-pre-wrap">
            {tags.length === 0 ? (
              post.category === 'archive' ? (
                <div className="h-[63px] md:h-[175px] ">
                  <MDEditor.Markdown style={{ color: '#8f8f8f ' }} source={markdownFilterSlang(processedContent)} />
                </div>
              ) : (
                <div className="line-clamp-3 md:line-clamp-6 ">
                  <MDEditor.Markdown style={{ color: '#8f8f8f ' }} source={markdownFilterSlang(processedContent)} />
                </div>
              )
            ) : post.category === 'archive' ? (
              <div className=" h-[63px] md:h-[130px] ">
                <MDEditor.Markdown style={{ color: '#8f8f8f ' }} source={markdownFilterSlang(processedContent)} />
              </div>
            ) : (
              <div className=" line-clamp-3 md:line-clamp-5 ">
                <MDEditor.Markdown style={{ color: '#8f8f8f ' }} source={markdownFilterSlang(processedContent)} />
              </div>
            )}
          </div>
        </div>
        {tags.length > 0 && (
          <div className="mb-4 md:mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className=" bg-neutral-50 text-neutral-700 text-caption2 md:text-subtitle2 md:font-medium font-regular rounded-[4px] p-[4px_12px] mr-[6px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center">
          <span className="text-body3 md:text-body1 font-medium text-neutral-800">{post.user.nickname}</span>
        </div>
        <div className="flex justify-between mt-1">
          <div className="flex items-center">
            <span className="mr-5" onClick={handleLikeButtonClick}>
              <NewLikeButton isLiked={isLiked} likeCount={likeCount} onClick={handleOnLike} />
            </span>
            <CommentBubble stroke="#8F8F8F" />
            <span className="flex ml-1 text-body3 md:text-body1 font-medium text-neutral-400">
              {post.commentsCount}
            </span>
          </div>
          <div>
            <span className=" text-body3 md:text-body1 font-regular text-neutral-500">
              {dayjs(post.created_at).format('YYYY-MM-DD')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchPostCard;
