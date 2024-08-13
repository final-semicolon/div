import MDEditor, { commands } from '@uiw/react-md-editor';
import { TpostReply, Treply } from '@/types/posts/qnaDetailTypes';
import Image from 'next/image';
import { timeForToday } from '@/utils/timeForToday';
import { useAuth } from '@/context/auth.context';
import Chip from '@/components/common/Chip';
import Tag from '@/components/common/Tag';
import { cutText, filterSlang } from '@/utils/markdownCut';
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
      ? { replyContent, replyId: reply.id, replyType: 'question' }
      : {
          commentId,
          replyContent,
          replyId: reply.id,
          replyType: 'answer'
        }
  );
  const { me } = useAuth();

  return (
    <div
      key={reply.id}
      className={`relative py-6 px-5 left-0 border-b ${reply.user_id === me?.id ? 'bg-sub-50' : 'bg-white'}`}
    >
      <div className="flex h-[86px]  items-center gap-4 ">
        <div className="relative w-12 h-12">
          <Image
            src={reply.users?.profile_image ?? ''}
            alt="Profile"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          {postUser === me?.id ? <Tag intent="primary" label="글쓴이" /> : null}
          <div className="text-subtitle1 text-neutral-900">{reply.users.nickname}</div>
          <div className="text-body2 text-neutral-300">{timeForToday(reply.updated_at!)}</div>
        </div>
        {me?.id === reply.user_id ? (
          <div className="flex ml-auto mb-auto">
            <KebobBtn replyId={reply.id} setIsEdit={setIsEdit} category={'questionReply'} />
          </div>
        ) : null}
      </div>

      {isEdit ? (
        <div className="flex flex-col  mb-6 mx-5  gap-[16px] ">
          <div className="bg-white border border-neutral-100 rounded-2xl">
            <MDEditor
              value={content}
              onChange={handleContentChange}
              preview="edit"
              commands={commands.getCommands().filter((command) => {
                return command.name !== 'image';
              })}
              textareaProps={{ maxLength: 1000 }}
              extraCommands={commands.getCommands().filter(() => false)}
            />
          </div>
          <div className="ml-auto flex gap-4">
            <Chip intent={'gray'} size="medium" label="취소" onClick={handleCancleClick} />
            <Chip
              intent={`${content.length === 0 ? 'primary_disabled' : 'primary'}`}
              size="medium"
              label="등록"
              onClick={handleEditReply}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col mb-6 mx-5  gap-[16px]">
          {seeMore ? (
            <MDEditor.Markdown source={filterSlang(replyContent)} />
          ) : (
            <>
              <MDEditor.Markdown source={cutText(replyContent, 344)} />
              <button
                className={`${content.length > 350 ? '' : 'hidden'} text-start text-subtitle2 text-neutral-700`}
                onClick={handleSeeMoreClick}
              >
                ...더 보기
              </button>
            </>
          )}

          <div className="text-neutral-400">{reply.created_at.slice(0, 10)}</div>
        </div>
      )}
    </div>
  );
};

export default Reply;
