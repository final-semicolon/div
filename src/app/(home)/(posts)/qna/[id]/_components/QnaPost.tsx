'use client';

import BackArrowIcon from '@/assets/images/upsert_image/BackArrowIcon';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import QnaQuestion from './qna-post/QnaQuestion';
import PostingQnaAnswer from './qna-post/PostingQnaAnswer';
import { TqnaData } from '@/types/posts/qnaDetailTypes';
import QnaAnswers from './qna-post/QnaAnswers';
import GoToTop from '@/assets/images/common/GoToTop';
import { useQnaDetailStore } from '@/store/qnaDetailStore';

type QnaPostProps = {
  data: TqnaData;
  postId: string;
};

const QnaPost = ({ data }: QnaPostProps) => {
  const { me } = useAuth();
  const { setPostId, setPostUser, setSeletedComment } = useQnaDetailStore();
  const [content, setContent] = useState<string>('');
  const [qnaCommentsCount, setQnaCommentsCount] = useState<number>(data.qna_comments[0].count);

  const handleTopBtnClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setPostId(data.id);
    setPostUser(data.user_id);
    setSeletedComment(data.selected_comment ?? '');
  }, [data]);

  return (
    <div>
      <div className="mb-8">
        <Link className="mb-4" href={'/qna'}>
          <BackArrowIcon />
        </Link>
      </div>
      <QnaQuestion questionData={data} />
      {me && me.id !== data.user_id ? (
        <PostingQnaAnswer content={content} setContent={setContent} setQnaCommentsCount={setQnaCommentsCount} />
      ) : null}
      <QnaAnswers
        qnaCommentsCount={qnaCommentsCount}
        questioner={data.user_id}
        setQnaCommentsCount={setQnaCommentsCount}
      />
      <button className=" fixed right-[168px] bottom-[62px]" onClick={handleTopBtnClick}>
        <GoToTop />
      </button>
    </div>
  );
};

export default QnaPost;
