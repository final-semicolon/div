import QnaAnswer from './QnaAnswer';
import { useQuery } from '@tanstack/react-query';
import NotFound from '@/app/not-found';
import { useState } from 'react';
import { TqnaCommentsWithReplyCount } from '@/types/posts/qnaDetailTypes';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { toast } from 'react-toastify';
import Loading from '@/app/(home)/loading';
import QnaAnswerSkeleton from '../skeleton/QnaAnswerSkeleton';
import CommentPageButton from '@/components/common/CommentPageButton';

type QnaAnswersProps = {
  qnaCommentsCount: number;
  questioner: string;
};

const QnaAnswers = ({ qnaCommentsCount, questioner }: QnaAnswersProps) => {
  const { postId, selectedComment, setCommentPage } = useQnaDetailStore();
  const [page, setPage] = useState<number>(1);
  const [sortedByLikes, setSortedByLikes] = useState<boolean>(false);
  const pageParamList = [...Array(Math.ceil(qnaCommentsCount / 5))].map((_, idx) => idx + 1);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const {
    isPending,
    isError,
    data: qnaCommentList
  } = useQuery({
    queryKey: sortedByLikes ? ['qnaComments', postId, page, 'likes'] : ['qnaComments', postId, page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/comment/${postId}?page=${page}&selected=${selectedComment}&sortedByLikes=${sortedByLikes}`
      );
      const {
        data,
        message
      }: { data: TqnaCommentsWithReplyCount[] & { qna_comment_likes?: { count: number } }; message: string } =
        await response.json();

      if (message) {
        toast.error(message);
        return;
      }
      return data;
    },
    enabled: !!postId,
    gcTime: 5 * 60 * 1000, // 5분
    staleTime: 1 * 60 * 1000, // 1분
    retry: 1
  });

  if (isPending) {
    return <QnaAnswerSkeleton />;
  }
  if (isError) {
    return <NotFound />;
  }

  return (
    <div>
      {qnaCommentList
        ? qnaCommentList.map((qnaComment, index) => {
            return index === 0 ? (
              <QnaAnswer
                key={qnaComment.id + 'comment'}
                sortedByLikes={sortedByLikes}
                setSortedByLikes={setSortedByLikes}
                qnaComment={qnaComment}
                questioner={questioner}
                index={index}
                qnaCommentsCount={qnaCommentsCount}
              />
            ) : (
              <QnaAnswer key={qnaComment.id + 'comment'} qnaComment={qnaComment} questioner={questioner} />
            );
          })
        : null}
      <div className=" flex pb-[76px] w-full justify-center">
        <CommentPageButton
          currentPage={page}
          itemsPerPage={5}
          totalItems={qnaCommentsCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default QnaAnswers;
