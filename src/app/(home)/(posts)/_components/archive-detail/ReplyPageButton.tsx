'use client';

import { archiveReplyType } from '@/types/posts/archiveDetailTypes';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type archiveReplyPageProps = {
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<archiveReplyType, unknown>, Error>>;
  reply: InfiniteData<archiveReplyType> | undefined;
};

const ReplyPageButton = ({ page, setPage, totalPage, fetchNextPage, reply }: archiveReplyPageProps) => {
  const handleNextPage = async () => {
    if (page < totalPage - 1) {
      const nextPage = page + 1;
      if (!reply?.pageParams?.includes(nextPage)) {
        await fetchNextPage();
      }
      setPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <button onClick={handlePrevPage} disabled={page === 0 || totalPage === 1}>
        <svg
          className={`${totalPage === 1 ? 'hidden' : ''} ${page === 0 ? 'stroke-neutral-100 ' : 'stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'} bg-neutral-50  rounded    `}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <path
            d="M19.5 10L13.6414 15.8586C13.5633 15.9367 13.5633 16.0633 13.6414 16.1414L19.5 22"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button onClick={handleNextPage} disabled={totalPage === page + 1 || totalPage === 1}>
        <svg
          className={`${totalPage === 1 ? 'hidden' : ''} ${totalPage === page + 1 ? 'stroke-neutral-100' : 'stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'} bg-neutral-50 rounded  `}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <path
            d="M13.5 10L19.3586 15.8586C19.4367 15.9367 19.4367 16.0633 19.3586 16.1414L13.5 22"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </>
  );
};

export default ReplyPageButton;
