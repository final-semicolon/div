'use client';

import useFetchQnaPosts from '@/hooks/qna/useFetchQnaPosts';
import PopularQnaPostItem from './PopularQnaPostItem';
import { Suspense } from 'react';
import { NoPostsPlaceholder, PopularQnaPostsSkeleton } from '../skeleton/PopularQnaPostsSkeleton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import CommentPageButton from '@/components/common/CommentPageButton';

const Error = ({ message }: { message: string }) => <div>Error: {message}</div>;

const PopularQnaPosts = () => {
  const pageSize = 6;

  const {
    data: popularPosts,
    error: popularError,
    isPending: isPendingPopular,
    isError: isErrorPopular,
    page: popularPage,
    totalPages: popularTotalPages,
    goToPage: goToPopularPage
  } = useFetchQnaPosts('popular', pageSize);

  if (isPendingPopular) {
    return <PopularQnaPostsSkeleton />;
  }

  if (isErrorPopular) {
    return <Error message={popularError?.message || 'Unknown error occurred'} />;
  }

  const startIndex = (popularPage - 1) * pageSize;

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
          <CommentPageButton
            totalItems={popularTotalPages * pageSize}
            itemsPerPage={pageSize}
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
          <CommentPageButton
            totalItems={popularTotalPages * pageSize}
            itemsPerPage={pageSize}
            currentPage={popularPage}
            onPageChange={goToPopularPage}
          />
        </div>
      </Mobile>
    </>
  );
};

export default PopularQnaPosts;
