'use client';

import GradCap from '@/assets/images/qna/GradCap';
import useFetchQnaPosts from '@/hooks/qna/useFetchQnaPosts';
import PopularQnaPostItem from './PopularQnaPostItem';
import { Suspense } from 'react';
import PopularQnaPagination from './PopualrQnaPagination';
import { NoPostsPlaceholder, PopularQnaPostsSkeleton } from '../skeleton/PopularQnaPostsSkeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

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
    return <PopularQnaPostsSkeleton />;
  }

  if (isErrorPopular) {
    return <Error message={popularError?.message || 'Unknown error occurred'} />;
  }

  const pageSize = 6;
  const startIndex = popularPage * pageSize;

  return (
    <>
      <Default>
        <div className="w-[1204px] mx-auto p-4 mb-[120px]">
          <Suspense fallback={<PopularQnaPostsSkeleton />}>
            {popularPosts && popularPosts.length > 0 ? (
              <ul className="grid grid-cols-2">
                {popularPosts.map((post, index) => (
                  <PopularQnaPostItem key={post.id} post={post} index={index} startIndex={startIndex} />
                ))}
              </ul>
            ) : (
              <NoPostsPlaceholder />
            )}
          </Suspense>
          <PopularQnaPagination
            totalPages={popularTotalPages}
            currentPage={popularPage}
            onPageChange={goToPopularPage}
          />
        </div>
      </Default>
      <Mobile>
        <div className="w-full mx-auto px-5 mb-16">
          <Suspense fallback={<PopularQnaPostsSkeleton />}>
            {popularPosts && popularPosts.length > 0 ? (
              <ul className="grid grid-cols-1">
                {popularPosts.map((post, index) => (
                  <PopularQnaPostItem key={post.id} post={post} index={index} startIndex={startIndex} />
                ))}
              </ul>
            ) : (
              <NoPostsPlaceholder />
            )}
          </Suspense>
          <PopularQnaPagination
            totalPages={popularTotalPages}
            currentPage={popularPage}
            onPageChange={goToPopularPage}
          />
        </div>
      </Mobile>
    </>
  );
};

export default PopularQnaPosts;
