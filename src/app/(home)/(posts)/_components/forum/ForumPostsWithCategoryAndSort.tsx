'use client';

import useFetchForumPosts from '@/hooks/forum/useFetchForumPosts';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { ForumCategory, Post, SortOption } from '@/types/posts/forumTypes';
import PostCard from './card/PostCard';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import SortDropdown from '@/components/common/SortDropdownGrey';
import CategoryTabs from './CategoryTabs';
import WriteButton from '@/assets/images/forum/WriteButton';
import EndOfData from '@/components/common/EndOfData';
import { useAuth } from '@/context/auth.context';
import { LikeType } from '@/types/buttons/like';
import PostCardSkeleton from './skeleton/PostCardSkeleton';

const ForumPostsWithCategoryAndSort = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, error } = useFetchForumPosts();
  const [activeCategory, setActiveCategory] = useState<ForumCategory>('전체');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [ref, inView] = useInView();
  const { me } = useAuth();
  const currentUserId = me?.id;

  const categories: ForumCategory[] = ['전체', '일상', '커리어', '자기개발', '토론', '코드 리뷰'];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'mostComments', label: '댓글순' },
    { value: 'mostLikes', label: '좋아요순' }
  ];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const filterAndSortPosts = useCallback((posts: Post[], category: ForumCategory, sortMethod: SortOption): Post[] => {
    let filteredPosts = category === '전체' ? posts : posts.filter((post) => post.forum_category === category);

    switch (sortMethod) {
      case 'latest':
        return filteredPosts.sort((a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix());
      case 'mostComments':
        return filteredPosts.sort((a, b) => (b.forum_comment[0]?.count || 0) - (a.forum_comment[0]?.count || 0));
      case 'mostLikes':
        return filteredPosts.sort((a, b) => (b.forum_like_count[0]?.count || 0) - (a.forum_like_count[0]?.count || 0));
      default:
        return filteredPosts;
    }
  }, []);

  const handleCategoryClick = (category: ForumCategory) => {
    setActiveCategory(category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleLikeToggle = useCallback(
    async (postId: string, type: LikeType, action: 'like' | 'unlike') => {
      if (!currentUserId) return;
      try {
        const method = action === 'like' ? 'POST' : 'DELETE';
        const response = await fetch('/api/common/like/new-like', {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postId,
            userId: currentUserId,
            type
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to ${action} the post`);
        }

        const data = await response.json();
        console.log(`${action === 'like' ? 'Liked' : 'Unliked'} post with ID: ${postId}`, data);
      } catch (error) {
        console.error(`Error ${action === 'like' ? 'liking' : 'unliking'} post with ID: ${postId}`, error);
      }
    },
    [currentUserId]
  );

  const allPosts = data?.pages.flatMap((page) => page.data) || [];
  const filteredAndSortedPost = filterAndSortPosts(allPosts, activeCategory, sortBy);

  return (
    <div className="pl-6">
      <div className="category-and-sort flex items-center justify-between max-w-[844px] mx-auto">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          handleCategoryClick={handleCategoryClick}
        />
        <SortDropdown sortBy={sortBy} handleSortChange={handleSortChange} sortOptions={sortOptions} />
      </div>
      <div className="mt-8 mb-8 max-w-[844px] mx-auto border-b-2 border-b-neutral-50">
        <Link href="/posting" rel="preload">
          <WriteButton />
        </Link>
      </div>
      <div className="category-items max-w-[844px] mx-auto">
        {isPending && (
          <div className="posts-card">
            {[...Array(5)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        )}
        {error && <div>에러 발생</div>}
        {!isPending && !error && filteredAndSortedPost.length === 0 && <div>게시글이 없습니다.</div>}
        {!isPending && !error && filteredAndSortedPost.length > 0 && (
          <div className="posts-card">
            {filteredAndSortedPost.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={post.forum_like.some((like) => like.user_id === currentUserId)}
                likeCount={post.forum_like_count[0]?.count || 0}
                onLike={() => handleLikeToggle(post.id, 'forum', 'like')}
                onUnlike={() => handleLikeToggle(post.id, 'forum', 'unlike')}
              />
            ))}
          </div>
        )}
        {isFetchingNextPage && <div>추가 게시물 로딩중...</div>}
        <div ref={ref} className="h-1"></div>
        {!isPending && !error && !isFetchingNextPage && data && !hasNextPage && <EndOfData />}
      </div>
    </div>
  );
};

export default ForumPostsWithCategoryAndSort;
