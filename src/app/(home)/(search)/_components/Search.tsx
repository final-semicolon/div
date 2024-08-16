'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import SearchPostCard from './SearchPostCard';
import SearchFilter from './SearchFilter';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import PostCountDisplay from './PostCountDisplay';
import { SearchData } from '@/types/search/SearchType';

const Search = () => {
  const [data, setData] = useState<SearchData | null>(null);
  const [filters, setFilters] = useState({
    primaryCategory: 'all' as 'all' | 'qna' | 'forum' | 'archive',
    primaryForumCategory: null as string | null,
    sortingType: 'all' as 'all' | 'time' | 'like' | 'comment'
  });

  const { me } = useAuth();
  const currentUserId = me?.id;

  const searchParams = useSearchParams();
  const searchType = searchParams.get('searchType');
  const keyword = searchParams.get('keyword');

  const fetchData = useCallback(async (searchType: string, keyword: string) => {
    try {
      const response = await fetch(`/api/search?searchType=${searchType}&keyword=${keyword}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching search data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (searchType && keyword) {
      fetchData(searchType, keyword).then(setData);
    }
  }, [searchType, keyword, fetchData]);

  const combined = useMemo(() => {
    if (!data) return [];
    return [...data.archive, ...data.forum, ...data.qna];
  }, [data]);

  const sortedItems = useMemo(() => {
    return combined.sort((a, b) => {
      switch (filters.sortingType) {
        case 'time':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'like':
          return b.likesCount - a.likesCount;
        case 'comment':
          return b.commentsCount - a.commentsCount;
        default:
          return 0;
      }
    });
  }, [combined, filters.sortingType]);

  const categoryFilteredItems = useMemo(() => {
    if (filters.primaryCategory === 'all') return sortedItems;
    if (filters.primaryCategory === 'forum') {
      return sortedItems.filter(
        (item) =>
          item.category === 'forum' &&
          (!filters.primaryForumCategory ||
            filters.primaryForumCategory === '전체' ||
            item.forum_category === filters.primaryForumCategory)
      );
    }
    return sortedItems.filter((item) => item.category === filters.primaryCategory);
  }, [sortedItems, filters.primaryCategory, filters.primaryForumCategory]);

  const renderItems = useMemo(() => {
    if (categoryFilteredItems.length === 0) {
      return <div>{keyword} 검색 결과가 없습니다.</div>;
    }
    return (
      <div className="grid grid-cols-1 gap-y-9 gap-x-5 md:grid-cols-2 justify-center">
        {categoryFilteredItems.map((post) => (
          <SearchPostCard
            key={post.id}
            post={post}
            isLiked={post.isLiked.user_id === currentUserId}
            currentUserId={currentUserId}
            primaryCategory={filters.primaryCategory}
          />
        ))}
      </div>
    );
  }, [categoryFilteredItems, keyword, currentUserId, filters.primaryCategory]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-[1204px]">
      <div className="flex flex-col">
        <span className="mb-[88px]">
          <span className="text-neutral-900 text-h3 font-bold">{searchType === 'title' ? keyword : `#${keyword}`}</span>
          <span className="text-neutral-700 text-h3 font-normal"> 검색결과</span>
        </span>
        <PostCountDisplay
          primaryCategory={filters.primaryCategory}
          archiveCount={data.archive.length}
          forumCount={data.forum.length}
          qnaCount={data.qna.length}
        />
        <div className="relative">
          <SearchFilter
            primaryCategory={filters.primaryCategory}
            primaryForumCategory={filters.primaryForumCategory}
            sortingType={filters.sortingType}
            onCategoryChange={(value) => setFilters((prev) => ({ ...prev, primaryCategory: value }))}
            onForumCategoryChange={(value) => setFilters((prev) => ({ ...prev, primaryForumCategory: value }))}
            onTypeChange={(value) => setFilters((prev) => ({ ...prev, sortingType: value }))}
          />
        </div>
      </div>
      {renderItems}
    </div>
  );
};

export default Search;
