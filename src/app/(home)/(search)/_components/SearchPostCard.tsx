import CommentBubble from '@/assets/images/common/CommentBubble';
import NewLikeButton from '@/components/common/NewLikeButton';
import useDebounce from '@/hooks/common/useDebounce';
import { SearchPost } from '@/types/search/SearchType';
import { cutText, markdownCutText, markdownFilterSlang } from '@/utils/markdownCut';
import MDEditor from '@uiw/react-md-editor';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type SearchPostCardProps = {
  post: SearchPost;
  isLiked: boolean;
  currentUserId?: string;
};

const removeImageLinks = (markdown: string) => {
  return markdown.replace(/!\[.*?\]\(.*?\)/g, '');
};

const SearchPostCard = ({ post, isLiked: initialIsLiked, currentUserId }: SearchPostCardProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [lastAction, setLastAction] = useState<'like' | 'unlike' | null>(null);

  const formCategory = post.category === 'forum' ? post.forum_category : undefined;
  const tags = post.tag?.map((tag) => tag.tag) || [];
  const processedContent = removeImageLinks(post.content);
  const debouncedLastAction = useDebounce(lastAction, 1000);

  useEffect(() => {
    if (debouncedLastAction === 'like') {
      handleLike(post.id, post.category);
    } else if (debouncedLastAction === 'unlike') {
      handleUnlike(post.id, post.category);
    }
  }, [debouncedLastAction]);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleLike = async (postId: string, type: 'archive' | 'forum' | 'qna') => {
    if (!currentUserId) return;
    try {
      const response = await fetch('/api/common/like/new-like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, userId: currentUserId, type })
      });

      if (!response.ok) {
        throw new Error('Failed to like the post');
      }

      const data = await response.json();
      console.log(`Liked post with ID: ${postId}`, data);
    } catch (error) {
      console.error(`Error liking post with ID: ${postId}`, error);
    }
  };

  const handleUnlike = async (postId: string, type: 'archive' | 'forum' | 'qna') => {
    if (!currentUserId) return;
    try {
      const response = await fetch('/api/common/like/new-like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, userId: currentUserId, type })
      });

      if (!response.ok) {
        throw new Error('Failed to unlike the post');
      }

      const data = await response.json();
      console.log(`Unliked post with ID: ${postId}`, data);
    } catch (error) {
      console.error(`Error unliking post with ID: ${postId}`, error);
    }
  };

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

  const handleLikeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOnLike();
  };

  return (
    <Link href={`/${post.category}/${post.id}`}>
      <div className="p-[20px_24px] md:w-[592px] w-[335px] md:h-[381px] h-[222px] border border-neutral-100 rounded-2xl flex flex-col">
        <div className="flex-1">
          <div className="mb-4 md:mb-5">
            <div className="flex items-center text-body3 md:text-body1 font-regular text-neutral-500">
              {post.category === 'qna' ? <p> Q&A </p> : post.category === 'forum' ? <p> 포럼</p> : <p> 라이브러리 </p>}
              {formCategory && (
                <span className="ml-1">
                  <span className="text-neutral-100">•</span> {formCategory}
                </span>
              )}
            </div>
            <p className="text-body3 md:text-body1 font-bold text-neutral-800 line-clamp-1 ">
              {cutText(post.title, 45)}
            </p>
          </div>
          {tags.length === 0 ? (
            post.category === 'archive' ? (
              <div className="  overflow-hidden h-[63px] md:h-[175px] break-words whitespace-pre-wrap">
                <MDEditor.Markdown className="search-markdown-text" source={markdownFilterSlang(processedContent)} />
              </div>
            ) : (
              <div className=" overflow-hidden line-clamp-3 md:line-clamp-6 break-words whitespace-pre-wrap">
                <MDEditor.Markdown className="search-markdown-text" source={markdownFilterSlang(processedContent)} />
              </div>
            )
          ) : post.category === 'archive' ? (
            <div className=" overflow-hidden h-[130px] break-words whitespace-pre-wrap">
              <MDEditor.Markdown className="search-markdown-text" source={markdownFilterSlang(processedContent)} />
            </div>
          ) : (
            <div className="overflow-hidden line-clamp-3 md:line-clamp-5 break-words whitespace-pre-wrap">
              <MDEditor.Markdown className="search-markdown-text" source={markdownFilterSlang(processedContent)} />
            </div>
          )}
        </div>
        {tags.length > 0 && (
          <div className="my-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className=" bg-neutral-50 text-neutral-700 text-caption2 md:text-subtitle2 font-medium rounded-[4px] p-[4px_12px] mr-[6px]"
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
