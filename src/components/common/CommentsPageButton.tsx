'use client';

import { Dispatch, SetStateAction } from 'react';

type forumReplyPageProps = {
  commentsPage: number;
  setCommentsPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
};

const CommentsPageButton = ({ commentsPage, setCommentsPage, totalPage }: forumReplyPageProps) => {
  return (
    <div className="flex justify-end items-end gap-2 mt-4">
      <button onClick={() => setCommentsPage((prev) => Math.max(prev - 1, 1))} disabled={commentsPage === 1}>
        이전
      </button>
      {[...Array(totalPage)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setCommentsPage(index + 1)}
          style={{
            fontWeight: commentsPage === index + 1 ? 'bold' : 'normal',
            margin: '0 5px'
          }}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => setCommentsPage((prev) => Math.max(prev + 1, totalPage))}
        disabled={commentsPage === totalPage}
      >
        다음
      </button>
    </div>
  );
};

export default CommentsPageButton;
