import MDEditor, { commands } from '@uiw/react-md-editor';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import AnswerReplytKebobBtn from '../kebob-btn/AnswerReplytKebobBtn';
import { Treply } from '@/types/posts/qnaDetailTypes';
import Image from 'next/image';
import { timeForToday } from '@/utils/timeForToday';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Tag from '@/components/common/Tag';
import { cutText, filterSlang } from '@/utils/markdownCut';
import Chip from '@/components/common/Chip';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';

type AnswerReplyProps = {
  reply: Treply;
  setReplyCount: Dispatch<SetStateAction<number>>;
};

const AnswerReply = ({ reply, setReplyCount }: AnswerReplyProps) => {
  const [content, setContent] = useState<string>(reply.reply);
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { me } = useAuth();
  const { postUser } = useQnaDetailStore();
  const queryClient = useQueryClient();

  const handleContentChange = (value: string | undefined): void => {
    setContent(value!);
  };

  const handleCancleClick = () => {
    setIsEdit(false);
    setContent(reply.reply);
  };

  const handleEditReply: MouseEventHandler<HTMLButtonElement> = async () => {
    if (content.length === 0) {
      return;
    }
    const data = await editMutate({ replyId: reply.id, reply: content });
    toast.success(COMMENT_EDIT_ALERT_TEXT, { hideProgressBar: true });
    setIsEdit(false);
  };

  const editReply = async ({ replyId, reply }: { replyId: string; reply: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/qna-reply/${replyId}`, {
      method: 'PATCH',
      body: JSON.stringify({ reply })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: editReply,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['qnaReply', reply.comment_id] });
    }
  });

  return (
    <div key={reply.id} className={`relative left-0 border-b py-6 px-5 ${reply.user_id === me?.id ? 'bg-sub-50' : ''}`}>
      <div className="flex h-[86px]  items-center gap-[16px] ">
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
          <div className=" ml-auto mb-auto">
            <AnswerReplytKebobBtn
              commentId={reply.comment_id}
              replyId={reply.id}
              setReplyCount={setReplyCount}
              setIsEdit={setIsEdit}
            />
          </div>
        ) : (
          ''
        )}
      </div>
      {isEdit ? (
        <div className="flex flex-col min-h-[200px] mb-6 mx-5 mt-4 gap-4">
          <div className="border border-neutral-100 bg-white rounded-xl">
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
          <div className="flex gap-4 ml-auto">
            <Chip intent={'gray'} size={'medium'} label="취소" onClick={handleCancleClick} />
            <Chip
              intent={`${content.length === 0 ? 'primary_disabled' : 'primary'}`}
              size={'medium'}
              label="등록"
              onClick={handleEditReply}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col  mb-6 mx-5 gap-4">
          {seeMore ? (
            <MDEditor.Markdown source={filterSlang(reply.reply)} />
          ) : (
            <>
              <MDEditor.Markdown source={cutText(reply.reply, 344)} />
              <button
                className={`${content.length > 350 ? '' : 'hidden'} text-start text-subtitle2 text-neutral-700`}
                onClick={() => {
                  setSeeMore(true);
                }}
              >
                ...더 보기
              </button>
            </>
          )}

          <div className="text-neutral-400 ">{reply.created_at.slice(0, 10)}</div>
        </div>
      )}
    </div>
  );
};

export default AnswerReply;
