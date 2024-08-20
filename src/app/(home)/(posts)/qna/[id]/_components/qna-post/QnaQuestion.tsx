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
import Dot from '@/assets/images/common/Dot';
import CommentBubble from '@/assets/images/common/CommentBubble';
import { handleLinkCopy } from '@/utils/handleLinkCopy';

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
    <div className="md:max-w-[1204px] md:mb-6 md:px-6 md:py-12 px-5 py-5 mb-5 md:border md:rounded-2xl bg-white">
      <div className="md:mb-6 mb-5 flex flex-col gap-2">
        <div className="md:max-w-[1156px] md:mb-4 mb-2 flex md:justify-between gap-2">
          <div className="md:text-h4 text-body2 md:font-bold flex gap-2">
            <span className=" md:mr-2 text-main-400 md:font-bold font-regular ">Q.</span>
            <h2 className=" text-neutral-900 font-medium inline md:font-bold md:max-w-full">
              {filterSlang(questionData.title)}
            </h2>
          </div>
          {me?.id === questionData.user_id ? <QuestionKebobBtn /> : null}
        </div>

        <div className="md:text-body1 text-body4 md:font-regular md:text-neutral-500 flex md:gap-4 items-center gap-2">
          {questionData.users.profile_image ? (
            <div className="relative md:min-w-12 md:min-h-12 min-w-7 min-h-7">
              <Image
                src={questionData.users.profile_image ?? ''}
                alt="Profile"
                fill
                className="rounded-full"
                sizes="48px,48px"
                loading="lazy"
              />
            </div>
          ) : null}
          <span className="md:text-neutral-500 text-neutral-700 ">{questionData.users.nickname}</span>
          <span>
            <Dot />
          </span>
          <span className="whitespace-nowrap text-neutral-500">{timeForToday(questionData.updated_at ?? '')}</span>
        </div>
      </div>
      <div className=" md:max-w-[1204px] flex md:my-6 my-5 md:text-body1 text-body3 font-regular">
        <MDEditor.Markdown style={{ maxWidth: '100%' }} source={filterSlang(questionData.content)} />
      </div>
      <div className="flex flex-wrap gap-2 md:gap-[6px]">
        {questionData.qna_tags
          ? questionData.qna_tags.map((tag) => <TagBlock key={'question' + tag.tag} tag={tag.tag} />)
          : null}
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start md:my-5 md:gap-5">
        <div className="whitespace-nowrap w-full md:w-auto md:text-body1 md:my-0 my-5 text-body3 text-neutral-400 ">{`${questionData.updated_at?.slice(0, 10).split('-').join('. ')}`}</div>
        <div className="w-full flex md:justify-end md:gap-4 gap-2 items-center">
          <div className="flex md:gap-1">
            <LikeButton id={questionData.id} type={'qna'} />
          </div>
          <div className="flex md:gap-1">
            <BookmarkButton id={questionData?.id} type={'qna'} />
          </div>
          <button
            type="button"
            onClick={() => handleLinkCopy(`${process.env.NEXT_PUBLIC_BASE_URL}/qna/${questionData.id}`)}
          >
            <Share />
          </button>
          <button className="flex gap-1  font-medium text-body3 md:text-subtitle1 ml-auto " onClick={handleReplyClick}>
            {questionData?.qna_post_reply[0].count !== 0 && openQuestionReply ? (
              <div className="text-main-400 ">{questionData?.qna_post_reply[0].count}개의 댓글</div>
            ) : questionData?.qna_post_reply[0].count !== 0 ? (
              <div className="flex gap-[2px] md:gap-1 text-neutral-400 items-center">
                <CommentBubble />
                {questionData?.qna_post_reply[0].count}
              </div>
            ) : openQuestionReply ? (
              <div className="  text-main-400 font-medium">댓글 쓰기</div>
            ) : (
              <div className={`${openQuestionReply ? 'text-main-400' : 'text-neutral-400'} `}>댓글 쓰기</div>
            )}
          </button>
        </div>
      </div>
      {openQuestionReply ? <Replies replyCount={questionData?.qna_post_reply[0].count} /> : null}
    </div>
  );
};

export default QnaQuestion;
