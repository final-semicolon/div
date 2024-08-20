import MDEditor, { commands } from '@uiw/react-md-editor';
import { TpostReply, Treply } from '@/types/posts/qnaDetailTypes';
import Image from 'next/image';
import { timeForToday } from '@/utils/timeForToday';
import { useAuth } from '@/context/auth.context';
import Chip from '@/components/common/Chip';
import Tag from '@/components/common/Tag';
import { filterSlang } from '@/utils/markdownCut';
import KebobBtn from '../kebob-btn/KebobBtn';
import useReply from '../../_hooks/reply/useReply';

type ReplyProps = {
  commentId?: string;
  reply: TpostReply | Treply;
};

const Reply = ({ commentId, reply }: ReplyProps) => {
  const replyContent = commentId ? (reply as Treply).reply : (reply as TpostReply).post_reply_content;

  const {
    postUser,
    isEdit,
    setIsEdit,
    content,
    seeMore,
    handleContentChange,
    handleCancleClick,
    handleSeeMoreClick,
    handleEditReply
  } = useReply(
    commentId
      ? {
          commentId,
          replyContent,
          replyId: reply.id,
          replyType: 'answer'
        }
      : { replyContent, replyId: reply.id, replyType: 'question' }
  );
  const { me } = useAuth();

  return (
    <div
      key={reply.id}
      className={`relative py-[10px] md:py-6 px-5 left-0 border-b ${reply.user_id === me?.id ? 'bg-sub-50' : 'bg-white'}`}
    >
      <div className="flex items-center gap-4 mb-2 md:mb-4">
        {reply.users.profile_image ? (
          <div className="relative min-w-9 min-h-9 md:min-w-12 md:min-h-12">
            <Image
              src={reply.users?.profile_image ?? ''}
              alt="Profile"
              fill
              className="rounded-full"
              sizes="48px,48px"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <div className="md:w-[66px] w-[34px]">
            {postUser === reply.user_id ? <Tag intent="primary" label="글쓴이" /> : null}
          </div>
          <div className="text-body4 font-medium md:text-subtitle1 text-neutral-900">{reply.users.nickname}</div>
          <div className="text-body4 md:text-body2 text-neutral-300">{timeForToday(reply.updated_at!)}</div>
        </div>
        {me?.id === reply.user_id ? (
          <div className="flex ml-auto mb-auto">
            <KebobBtn
              replyId={reply.id}
              setIsEdit={setIsEdit}
              category={commentId ? 'answerReply' : 'questionReply'}
              commentId={commentId ?? ''}
            />
          </div>
        ) : null}
      </div>

      {isEdit ? (
        <div className="flex flex-col  mb-6  gap-4 ">
          <div className="bg-white border border-neutral-100 rounded-lg md:rounded-2xl">
            <MDEditor
              value={content}
              onChange={handleContentChange}
              preview="edit"
              commands={commands.getCommands().filter((command) => {
                return command.name !== 'image' && command.name !== 'help';
              })}
              textareaProps={{ maxLength: 1000 }}
              extraCommands={commands.getCommands().filter(() => false)}
            />
          </div>
          <div className="ml-auto flex gap-4">
            <Chip intent={'gray'} size="medium" label="취소" onClick={handleCancleClick} />
            <Chip
              intent={`${content.trim().length === 0 ? 'primary_disabled' : 'primary'}`}
              size="medium"
              label="등록"
              onClick={handleEditReply}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col mb-[10px] md:mb-0  gap-4">
          {seeMore ? (
            <MDEditor.Markdown source={filterSlang(replyContent)} />
          ) : (
            <>
              <div className=" max-h-[105px] md:max-h-[130px] overflow-hidden">
                <MDEditor.Markdown source={filterSlang(replyContent)} />
              </div>
              <button
                className={`${content.length > 350 ? '' : 'hidden'} text-start text-subtitle3 md:text-subtitle2 font-bold text-neutral-700 md:hover:underline`}
                onClick={handleSeeMoreClick}
              >
                ...더 보기
              </button>
            </>
          )}

          <div className="text-neutral-400 text-body3 md:text-body1">
            {reply.created_at.slice(0, 10).split('-').join('. ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reply;
