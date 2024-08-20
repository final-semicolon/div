'use client';

import Chip from '@/components/common/Chip';
import { useAuth } from '@/context/auth.context';
import { CommentReply, forumCommentsType } from '@/types/posts/forumDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

type commentReplyProps = {
  comment_id: string;
  toggle: (id: string, count: number) => void;
  count: number;
  commentsPage: number;
};

const ForumReplyInput = ({ comment_id, toggle, count, commentsPage }: commentReplyProps) => {
  const { me, userData } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState('');

  //대댓글 입력
  const handleReply = useMutation({
    mutationFn: async (userReply: CommentReply) => {
      const response = await fetch(`/api/posts/forum-detail/forum-reply/${params.id}`, {
        method: 'POST',
        body: JSON.stringify(userReply)
      });
      const data = await response.json();
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['commentReply', comment_id] });
      if (comment_id) {
        await queryClient.setQueryData(['forumComments', params.id, commentsPage], (oldData: forumCommentsType) => {
          const newComment = oldData.data.map((comment) =>
            comment.id === comment_id ? { ...comment, reply: [{ count: data?.replyCount }] } : comment
          );
          return { ...oldData, data: newComment };
        });
      }
    }
  });

  const changReply = useCallback((value?: string) => {
    setReply(value!);
  }, []);

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const commentReply = { user_id: me?.id, comment_id, reply };

    if (!me?.id) {
      toast.error('로그인 후 입력가능합니다.');
      return;
    }
    setReply('');

    handleReply.mutate(commentReply);
  };

  return (
    <div className=" border-l-4 border-[#C7DCF5] border-b-[1px] px-6 py-5 md:p-6 mx-5 md:mx-0">
      <p className=" text-subtitle3 font-medium md:text-subtitle1 pb-5 md:pb-0">댓글 {count}</p>
      <div className="flex justify-center items-center gap-6">
        <Image
          src={userData?.profile_image ?? ''}
          alt="user profile image"
          width={48}
          height={48}
          className=" rounded-full hidden md:block  md:w-10 md:h-10"
        />
        <MDEditor
          value={reply}
          onChange={changReply}
          preview="edit"
          extraCommands={commands.getCommands().filter(() => false)}
          commands={commands.getCommands().filter((command) => {
            return command.name !== 'image';
          })}
          textareaProps={{ maxLength: 500 }}
          className="w-full border border-neutral-100  first-of-type:rounded-[12px] focus-within:border-main-400"
        />
      </div>

      <div className="flex justify-end items-end gap-4 mt-4">
        {reply === '' ? (
          <>
            <Chip intent="gray_disabled" size="medium" label="취소" />
            <Chip intent="primary_disabled" size="medium" label="등록" />
          </>
        ) : (
          <>
            <Chip intent="gray" size="medium" label="취소" onClick={() => toggle(comment_id, count)} />
            <Chip intent="primary" size="medium" label="등록" onClick={onClickReply} />
          </>
        )}
      </div>
    </div>
  );
};

export default ForumReplyInput;
