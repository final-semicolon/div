'use client';

import { Dispatch, SetStateAction } from 'react';

type forumReplyPageProps = {
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const ReplyPageButton = ({ page, setPage, totalPage }: forumReplyPageProps) => {
  return (
    <div className="flex justify-end items-end gap-2 mt-4">
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
        이전
      </button>
      <button onClick={() => setPage((prev) => Math.max(prev + 1, totalPage))} disabled={page === totalPage}>
        다음
      </button>
    </div>
  );
};

export default ReplyPageButton;
