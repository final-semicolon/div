'use client';

import useFetchForumPosts from '@/hooks/forum/useFetchForumPosts';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ForumCategory, Post, SortOption } from '@/types/posts/forumTypes';
import PostCard from './PostCard';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import SortDropdown from '@/components/common/SortDropdownGrey';
import CategoryTabs from './CategoryTabs';
import WriteButton from '@/assets/images/forum/WriteButton';
import EndOfData from '@/components/common/EndOfData';
import { useAuth } from '@/context/auth.context';
import { LikeType } from '@/types/buttons/like';

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

  const filterAndSortPosts = (posts: Post[], category: ForumCategory, sortMethod: SortOption): Post[] => {
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
  };

  const handleCategoryClick = (category: ForumCategory) => {
    setActiveCategory(category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  const allPosts = data?.pages.flatMap((page) => page.data) || [];
  const filteredAndSortedPost = filterAndSortPosts(allPosts, activeCategory, sortBy);

  const handleLike = async (postId: string, type: LikeType) => {
    if (!currentUserId) return;
    try {
      const response = await fetch('/api/common/like/new-like', {
        method: 'POST',
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
        throw new Error('Failed to like the post');
      }

      const data = await response.json();
      console.log(`Liked post with ID: ${postId}`, data);
    } catch (error) {
      console.error(`Error liking post with ID: ${postId}`, error);
    }
  };

  const handleUnlike = async (postId: string, type: LikeType) => {
    if (!currentUserId) return;
    try {
      const response = await fetch('/api/common/like/new-like', {
        method: 'DELETE',
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
        throw new Error('Failed to unlike the post');
      }

      const data = await response.json();
      console.log(`Unliked post with ID: ${postId}`, data);
    } catch (error) {
      console.error(`Error unliking post with ID: ${postId}`, error);
    }
  };

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
        <Link href="/posting">
          <WriteButton />
        </Link>
      </div>
      <div className="category-items max-w-[844px] mx-auto">
        {isPending && <div>로딩중...</div>}
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
                onLike={() => handleLike(post.id, 'forum')}
                onUnlike={() => handleUnlike(post.id, 'forum')}
              />
            ))}
          </div>
        )}
        {isFetchingNextPage && <div>추가 게시물 로딩중...</div>}
        <div className="h-1" ref={ref}></div>
        {!hasNextPage && !isFetchingNextPage && <EndOfData />}
      </div>
    </div>
  );
};

export default ForumPostsWithCategoryAndSort;
