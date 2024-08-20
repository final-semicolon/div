'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import SortDropdownGrey from '@/components/common/SortDropdownGrey';
import { useArchivePosts } from '@/hooks/archive/useFetchArchivePosts';
import { Post, SortOption } from '@/types/posts/archiveTypes';
import Pagination from './Pagination';
import ArchivePostCard from './ArchivePostCard';
import ArchivePostsSkeleton from './skeleton/ArchivePostsSkeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import ArchivePostCardMobile from './ArchivePostCardMobile';

const ArchivePosts = () => {
  const [page, setPage] = useState(0);
  const [sortMethod, setSortMethod] = useState<SortOption>('latest');
  const POSTS_PER_PAGE = 6;

  const {
    data: archiveResult,
    error: archiveError,
    isPending: isPendingArchive,
    isError: isErrorArchive
  } = useArchivePosts(page, POSTS_PER_PAGE, sortMethod);

  const filterAndSortPosts = (posts: Post[], sortMethod: SortOption): Post[] => {
    switch (sortMethod) {
      case 'latest':
        return posts.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix());
      case 'oldest':
        return posts.sort((a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix());
      case 'mostLikes':
        return posts.sort((a, b) => (b.archive_like[0]?.count || 0) - (a.archive_like[0]?.count || 0));
      default:
        return posts;
    }
  };

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '과거순' },
    { value: 'mostLikes', label: '인기순' }
  ];

  if (isPendingArchive) {
    return (
      <>
        <Default>
          <ArchivePostsSkeleton width={388} height={414} />
        </Default>
        <Mobile>
          <ArchivePostsSkeleton width={335} height={234} />
        </Mobile>
      </>
    );
  }

  if (isErrorArchive) {
    return <div>Error: {archiveError?.message}</div>;
  }

  const archivePosts = archiveResult?.data || [];
  const sortedPosts = filterAndSortPosts(archivePosts, sortMethod);
  const totalPages = Math.ceil((archiveResult?.count || 0) / POSTS_PER_PAGE);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(event.target.value as SortOption);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <>
      <Default>
        <>
          <div className="mb-9">
            <p className="text-subtitle1 text-neutral-400 font-medium mb-3">Level Up Course</p>
            <p className="text-h3 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
            <div className="flex items-center justify-between text-subtitle1 font-medium text-neutral-700 mt-6">
              <p className="flex items-center ">
                전체 게시글
                <p className="flex items-center text-subtitle1 font-bold text-neutral-800 ml-1">
                  ({archiveResult?.count || 0})
                </p>
              </p>
              <label className="flex items-center">
                <SortDropdownGrey sortBy={sortMethod} handleSortChange={handleSortChange} sortOptions={sortOptions} />
              </label>
            </div>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {sortedPosts.map((post) => (
                <ArchivePostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div>게시글이 없습니다.</div>
          )}
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
        </>
      </Default>
      <Mobile>
        <>
          <div className="mb-5 mx-5">
            <p className="text-subtitle3 text-neutral-400 font-medium mb-1">Level Up Course</p>
            <p className="text-subtitle2 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
            <div className="flex items-center justify-between text-subtitle3 font-medium text-neutral-700 mt-5">
              <p className="flex items-center ">
                전체 게시글
                <p className="flex items-center text-subtitle3 font-bold text-neutral-800 ml-1">
                  ({archiveResult?.count || 0})
                </p>
              </p>
              <label className="flex items-center">
                <SortDropdownGrey sortBy={sortMethod} handleSortChange={handleSortChange} sortOptions={sortOptions} />
              </label>
            </div>
          </div>
          {sortedPosts.length > 0 ? (
            <div className="flex flex-col mx-5">
              {sortedPosts.map((post) => (
                <ArchivePostCardMobile key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div>게시글이 없습니다.</div>
          )}
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
        </>
      </Mobile>
    </>
  );
};

export default ArchivePosts;
