import { useState } from 'react';
import NotFound from '@/app/not-found';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/app/(home)/loading';
import { TqnaReplyWithUser, Treply } from '@/types/posts/qnaDetailTypes';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import ReplyForm from './ReplyForm';
import Reply from './Reply';
import ReplyPageBtn from '@/components/common/ReplyPageBtn';
import QnaReplySkeleton from '../skeleton/QnaReplySkeleton';
import QnaReplyFormSkeleton from '../skeleton/QnaReplyFormSkeleton';

type AnswerCommentsProps = {
  commentId?: string;
  replyCount: number;
};

const Replies = ({ commentId, replyCount }: AnswerCommentsProps) => {
  const { postId } = useQnaDetailStore();
  const totalPage = Math.ceil(replyCount / 5);
  const [page, setPage] = useState<number>(1);
  const path = commentId ? `/qna-reply/${commentId}?page=${page}` : `/qna-post-reply/${postId}?page=${page}`;

  const {
    isPending,
    isError,
    data: qnaReplyList
  } = useQuery({
    queryKey: ['qnaReply', commentId ?? postId, page],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/${path}`);
      const { data } = await response.json();
      return data;
    },
    enabled: !!postId,
    gcTime: 5 * 60 * 1000, // 5분
    staleTime: 1 * 60 * 1000, // 1분
    retry: 1
  });

  const skelotonCount = replyCount < 5 ? replyCount : replyCount - page * 5 > 0 ? 5 : page * 5 - replyCount;
  if (isPending) {
    return (
      <>
        <QnaReplyFormSkeleton />
        <div className="flex flex-col mt-6 border-t-2">
          {Array(skelotonCount)
            .fill(null)
            .map((_, index) => {
              return <QnaReplySkeleton key={page + index} />;
            })}
        </div>
      </>
    );
  }

  if (isError) {
    return <NotFound />;
  }

  return (
    <div key={commentId + 'replies'}>
      <ReplyForm commentId={commentId ?? ''} />
      {qnaReplyList?.map((reply: Treply | TqnaReplyWithUser) => {
        return <Reply key={reply.id} reply={reply} commentId={commentId ?? ''} />;
      })}
      <ReplyPageBtn totalPage={totalPage} page={page} setPage={setPage} />
    </div>
  );
};

export default Replies;

{
}
