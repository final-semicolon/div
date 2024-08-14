import QnaAnswer from './QnaAnswer';
import { useInfiniteQuery } from '@tanstack/react-query';
import NotFound from '@/app/not-found';
import Loading from '@/app/(home)/loading';
import { useInView } from 'react-intersection-observer';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { TqnaCommentsWithReplyCount } from '@/types/posts/qnaDetailTypes';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import EndOfData from '@/components/common/EndOfData';

type QnaAnswersProps = {
  qnaCommentsCount: number;
  questioner: string;
};

const QnaAnswers = ({ qnaCommentsCount, questioner }: QnaAnswersProps) => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const { postId, seletedComment } = useQnaDetailStore();
  const getCommentList = async ({ queryKey, pageParam }: { queryKey: string[]; pageParam: number }) => {
    const [, id] = queryKey;
    const response = await fetch(`/api/posts/qna-detail/comment/${id}?page=${pageParam}&selected=${seletedComment}`);
    const { data, message } = await response.json();
    if (message) {
      return <NotFound />;
    }
    return data;
  };

  const {
    fetchNextPage,
    data: qnaCommentList,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['qnaComments', postId],
    initialPageParam: 0,
    queryFn: getCommentList,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1;
      return nextPage <= Math.floor(qnaCommentsCount / 3) ? nextPage : undefined;
    },
    staleTime: Infinity,
    select: ({ pages }) => pages.flat()
  });

  if (qnaCommentList && seletedComment) {
    const selectedCommentIndex = qnaCommentList.findIndex((comment) => comment.id === seletedComment);
    const selectedComment = qnaCommentList.filter((comment) => comment.id === seletedComment);
    qnaCommentList.splice(selectedCommentIndex, 1);
    qnaCommentList.unshift(...selectedComment);
  }

  useEffect(() => {
    if ((!seletedComment && qnaCommentsCount <= 3) || (seletedComment && qnaCommentsCount <= 4)) {
      refetch();
    } else if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, qnaCommentsCount]);

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound />;
  }

  return (
    <div key={postId + 'commentDiv'}>
      {qnaCommentList
        ? (qnaCommentList as TqnaCommentsWithReplyCount[]).map((qnaComment, index) => {
            return index === 0 ? (
              <QnaAnswer
                key={qnaComment.id + 'comment'}
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

      <div key={postId + 'observer'} className="h-20" ref={ref}></div>
      {!hasNextPage && !isFetchingNextPage && <EndOfData />}
    </div>
  );
};

export default QnaAnswers;
