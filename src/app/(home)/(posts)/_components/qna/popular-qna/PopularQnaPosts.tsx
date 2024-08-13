'use client';

import GradCap from '@/assets/images/qna/GradCap';
import useFetchQnaPosts from '@/hooks/qna/useFetchQnaPosts';
import PopularQnaPostItem from './PopularQnaPostItem';
import { Suspense } from 'react';
import PopularQnaPagination from './PopualrQnaPagination';

export const Loading = () => <div>Loading...</div>;

const Error = ({ message }: { message: string }) => <div>Error: {message}</div>;

const PopularQnaPosts = () => {
  const {
    data: popularPosts,
    error: popularError,
    isPending: isPendingPopular,
    isError: isErrorPopular,
    page: popularPage,
    totalPages: popularTotalPages,
    goToPage: goToPopularPage
  } = useFetchQnaPosts('popular');

  if (isPendingPopular) {
    return <Loading />;
  }

  if (isErrorPopular) {
    return <Error message={popularError?.message || 'Unknown error occurred'} />;
  }

  const pageSize = 6;
  const startIndex = popularPage * pageSize;

  return (
    <div className="w-[1204px] mx-auto p-4">
      <div className="flex justify-start items-center relative gap-1.5 mb-8">
        <p className="flex items-center text-h4 font-bold text-left text-neutral-900">
          인기 QnA
          <div className="ml-1">
            <GradCap />
          </div>
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        {popularPosts && popularPosts.length > 0 ? (
          <ul className="grid grid-cols-2">
            {popularPosts.map((post, index) => (
              <PopularQnaPostItem key={post.id} post={post} index={index} startIndex={startIndex} />
            ))}
          </ul>
        ) : (
          <div>게시물이 없습니다.</div>
        )}
      </Suspense>
      <PopularQnaPagination totalPages={popularTotalPages} currentPage={popularPage} onPageChange={goToPopularPage} />
    </div>
  );
};

export default PopularQnaPosts;
