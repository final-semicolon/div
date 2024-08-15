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
  const [primaryCategory, setPrimaryCategory] = useState<'all' | 'qna' | 'forum' | 'archive'>('all');
  const [primaryForumCategory, setPrimaryForumCategory] = useState<string | null>(null);
  const [sortingType, setSortingType] = useState<'time' | 'like' | 'comment'>('time');
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
      fetchData(searchType, keyword).then((data) => {
        if (data) {
          setData(data);
        }
      });
    }
  }, [searchType, keyword, fetchData]);

  const combined = useMemo(() => {
    if (!data) return [];
    return [...data.archive, ...data.forum, ...data.qna];
  }, [data]);

  const sortedItems = useMemo(() => {
    return combined.sort((a, b) => {
      if (sortingType === 'time') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortingType === 'like') {
        return b.likesCount - a.likesCount;
      }
      if (sortingType === 'comment') {
        return b.commentsCount - a.commentsCount;
      }
      return 0;
    });
  }, [combined, sortingType]);

  const categoryFilteredItems = useMemo(() => {
    if (primaryCategory === 'all') return sortedItems;
    if (primaryCategory === 'forum') {
      return sortedItems.filter(
        (item) =>
          item.category === 'forum' &&
          (primaryForumCategory === '전체' || !primaryForumCategory || item.forum_category === primaryForumCategory)
      );
    }
    return sortedItems.filter((item) => item.category === primaryCategory);
  }, [sortedItems, primaryCategory, primaryForumCategory]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-[1204px]">
      <div className="flex flex-col ">
        <span className="mb-[88px]">
          <span className="text-neutral-900 text-h3 font-bold">
            {searchType === 'title' ? <>{keyword}</> : <>#{keyword}</>}
          </span>
          <span className="text-neutral-700 text-h3 font-normal"> 검색결과</span>
        </span>
        <PostCountDisplay
          primaryCategory={primaryCategory}
          archiveCount={data.archive.length}
          forumCount={data.forum.length}
          qnaCount={data.qna.length}
        />
        <div className="relative">
          <SearchFilter
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            sortingType={sortingType}
            onCategoryChange={setPrimaryCategory}
            onForumCategoryChange={setPrimaryForumCategory}
            onTypeChange={setSortingType}
          />
        </div>
      </div>
      <div>
        {categoryFilteredItems.length === 0 ? (
          <div>{keyword} 검색 결과가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-y-9 gap-x-5 md:grid-cols-2 justify-center">
            {categoryFilteredItems.map((post) => (
              <SearchPostCard
                key={post.id}
                post={post}
                isLiked={post.isLiked.user_id === currentUserId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
