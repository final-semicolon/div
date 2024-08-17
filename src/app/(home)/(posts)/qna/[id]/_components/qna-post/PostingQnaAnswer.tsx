import { useAuth } from '@/context/auth.context';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import PostingAnswerArea from './PostingAnswerArea';

type PostingQnaAnswerProps = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
};

const PostingQnaAnswer = ({ content, setContent }: PostingQnaAnswerProps) => {
  const { userData: answer } = useAuth();
  const [toggleAnswer, setToggleAnswer] = useState<boolean>(false);

  const handleToggleClick = () => {
    setToggleAnswer((prev) => !prev);
  };

  return (
    <div
      className={`bg-white my-4 md:max-w-[1204px] md:max-h-[1224px] md:mt-0 md:mb-6 md:px-6 px-5 md:py-6 md:border md:rounded-2xl md:overflow-y-auto md:overflow-x-hidden ${toggleAnswer ? 'border-main-400' : ''}`}
    >
      <div className={`flex md:py-6 py-4 gap-x-4 md:max-w-[1154px] items-center ${toggleAnswer ? 'border-b' : ''} `}>
        {answer ? (
          <div className="relative md:min-w-12 md:min-h-12 min-h-9 min-w-9">
            <Image
              src={answer?.profile_image ?? ''}
              alt="Profile"
              fill
              className="rounded-full"
              sizes="48px,48px"
              loading="lazy"
            />{' '}
          </div>
        ) : null}

        <div className="flex flex-col md:max-w-[1060px] ">
          <span className="text-main-400 md:text-subtitle1 text-subtitle3 font-medium ">
            {answer?.nickname ?? ''}
            <span className="text-neutral-900">님</span>
          </span>
          <h2 className="md:text-h4 text-body2 font-bold h-[32px]">지식을 나눠주세요!</h2>
        </div>
        {toggleAnswer ? null : (
          <button
            className="ml-auto md:px-6 md:py-4 px-4 py-2 bg-main-400 text-white md:text-subtitle1 text-subtitle3 rounded-full hover:bg-main-500"
            onClick={handleToggleClick}
          >
            답변하기
          </button>
        )}
      </div>
      {toggleAnswer ? (
        <PostingAnswerArea content={content} setContent={setContent} setToggleAnswer={setToggleAnswer} />
      ) : null}
    </div>
  );
};

export default PostingQnaAnswer;
