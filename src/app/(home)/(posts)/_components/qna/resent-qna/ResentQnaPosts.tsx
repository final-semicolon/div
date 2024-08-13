'use client';

import React, { useEffect, useState, useCallback } from 'react';
import SortDropdown from '@/components/common/SortDropdownGrey';
import useFetchQnaPosts from '@/hooks/qna/useFetchQnaPosts';
import { Post, SortOption } from '@/types/posts/qnaTypes';
import dayjs from 'dayjs';
import Pagination from './Pagination';
import QnaPostItem from './QnaPostItem';
import StatusTabs from './StatusTabs';

const ResentQnaPosts = () => {
  const [status, setStatus] = useState('waiting');
  const [waitingPage, setWaitingPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [sortMethod, setSortMethod] = useState<SortOption>('latest');

  const {
    data: waitingPosts,
    error: waitingError,
    isPending: isPendingWaiting,
    isError: isErrorWaiting,
    totalPages: waitingTotalPages,
    goToPage: goToWaitingPage
  } = useFetchQnaPosts('waiting');

  const {
    data: selectedPosts,
    error: selectedError,
    isPending: isPendingSelected,
    isError: isErrorSelected,
    totalPages: selectedTotalPages,
    goToPage: goToSelectedPage
  } = useFetchQnaPosts('selected');

  useEffect(() => {
    if (status === 'waiting') {
      goToWaitingPage(waitingPage);
    } else {
      goToSelectedPage(selectedPage);
    }
  }, [status, waitingPage, selectedPage, goToWaitingPage, goToSelectedPage]);

  const filterAndSortPosts = useCallback((posts: Post[], sortMethod: SortOption): Post[] => {
    switch (sortMethod) {
      case 'latest':
        return posts.sort((a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix());
      case 'mostComments':
        return posts.sort((a, b) => (b.qna_comment[0]?.count || 0) - (a.qna_comment[0]?.count || 0));
      case 'mostLikes':
        return posts.sort((a, b) => (b.qna_like[0]?.count || 0) - (a.qna_like[0]?.count || 0));
      default:
        return posts;
    }
  }, []);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'mostComments', label: '댓글순' },
    { value: 'mostLikes', label: '좋아요순' }
  ];

  const posts = status === 'waiting' ? waitingPosts : selectedPosts;
  const totalPages = status === 'waiting' ? waitingTotalPages : selectedTotalPages;
  const setPage = status === 'waiting' ? setWaitingPage : setSelectedPage;

  const sortedPosts = posts ? filterAndSortPosts(posts, sortMethod) : [];

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(event.target.value as SortOption);
  }, []);

  if ((status === 'waiting' && isPendingWaiting) || (status === 'selected' && isPendingSelected)) {
    return <div>Loading...</div>;
  }

  if ((status === 'waiting' && isErrorWaiting) || (status === 'selected' && isErrorSelected)) {
    return <div>Error: {waitingError?.message || selectedError?.message}</div>;
  }

  return (
    <div>
      <StatusTabs status={status} setStatus={setStatus} />
      <div
        className={`w-full h-[88px] bg-sub-50 border-t-0 border-r-0 border-b border-l-0 border-sub-100 flex justify-end items-center pr-6`}
      >
        <label className="my-6 mr-6">
          <SortDropdown sortBy={sortMethod} handleSortChange={handleSortChange} sortOptions={sortOptions} />
        </label>
      </div>

      {sortedPosts.length > 0 ? (
        <ul>
          {sortedPosts.map((post: Post) => (
            <QnaPostItem key={post.id} post={post} />
          ))}
        </ul>
      ) : (
        <div>게시물이 없습니다.</div>
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={status === 'waiting' ? waitingPage : selectedPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ResentQnaPosts;
