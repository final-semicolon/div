import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { TqnaData } from '@/types/posts/qnaDetailTypes';
import Image from 'next/image';
import Share from '@/assets/images/common/Share';
import LikeButton from '@/components/common/LikeButton';
import { useAuth } from '@/context/auth.context';
import QuestionKebobBtn from '../kebob-btn/QuestionKebobBtn';
import { timeForToday } from '@/utils/timeForToday';
import BookmarkButton from '@/components/common/BookmarkButton';
import TagBlock from '@/components/common/TagBlock';
import { filterSlang } from '@/utils/markdownCut';
import Replies from '../qna-comments/Replies';

type QnaQuestionProps = {
  questionData: TqnaData;
};

const QnaQuestion = ({ questionData }: QnaQuestionProps) => {
  const { me } = useAuth();
  const [openQuestionReply, setOpenQuestionReply] = useState<boolean>(false);

  const handleReplyClick = () => {
    setOpenQuestionReply((prev) => !prev);
  };

  return (
    <div className="w-[1204px]  mb-6 px-6 py-12 border rounded-2xl bg-white">
      <div className="mb-6">
        <div className="w-[1156px] mb-4 flex justify-between">
          <div>
            <span className="text-h4 mr-2 font-bold text-main-400">Q.</span>
            <h2 className="text-h4 font-bold text-neutral-900 inline">{filterSlang(questionData.title)}</h2>
          </div>
          {me?.id === questionData.user_id ? <QuestionKebobBtn /> : null}
        </div>

        <div className="flex gap-4 items-center">
          {questionData.users.profile_image ? (
            <div className="relative w-12 h-12">
              <Image
                src={questionData.users.profile_image ?? ''}
                alt="Profile"
                className="rounded-full"
                width={48}
                height={48}
              />
            </div>
          ) : null}
          <span className="text-body1 text-neutral-500">{questionData.users.nickname}</span>
          <span className="text-body1 text-neutral-500">{timeForToday(questionData.updated_at ?? '')}</span>
        </div>
      </div>
      <div className=" max-w-[1204px] flex my-6">
        <MDEditor.Markdown style={{ maxWidth: '1156px' }} source={filterSlang(questionData.content)} />
      </div>
      <div className="flex gap-2">
        {questionData.qna_tags
          ? questionData.qna_tags.map((tag) => <TagBlock key={'question' + tag.tag} tag={tag.tag} />)
          : null}
      </div>
      <div className="flex justify-between h-[59px] items-center">
        <span className="text-body1 text-neutral-400">{questionData.updated_at?.slice(0, 10)}</span>
        <div className="flex gap-6 items-center">
          <div className="flex gap-1">
            <LikeButton id={questionData.id} type={'qna'} />
          </div>
          <div className="flex gap-1">
            <BookmarkButton id={questionData.id} type={'qnaComment'} />
          </div>
          <button>
            <Share />
          </button>
          <button className="flex gap-1" onClick={handleReplyClick}>
            {questionData?.qna_post_reply[0].count !== 0 && openQuestionReply ? (
              <div className="text-main-400 text-subtitle1 font-medium">댓글 모두 숨기기</div>
            ) : questionData?.qna_post_reply[0].count !== 0 ? (
              <div className="text-main-400 text-subtitle1 font-medium">
                {questionData?.qna_post_reply[0].count}개의 댓글
              </div>
            ) : openQuestionReply ? (
              <div className=" text-subtitle1 font-medium">댓글 쓰기</div>
            ) : (
              <div className={`${openQuestionReply ? 'text-main-400' : 'text-neutral-400'} text-subtitle1 font-medium`}>
                댓글 쓰기
              </div>
            )}
          </button>
        </div>
      </div>
      {openQuestionReply ? <Replies replyCount={questionData?.qna_post_reply[0].count} /> : null}
    </div>
  );
};

export default QnaQuestion;
