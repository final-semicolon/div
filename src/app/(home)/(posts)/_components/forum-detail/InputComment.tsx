'use client';
import { revalidatePostTag } from '@/actions/revalidatePostTag';
import Chip from '@/components/common/Chip';
import { COMMENT_POST_ALERT_TEXT } from '@/constants/alert';
import { useAuth } from '@/context/auth.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const InputComments = () => {
  const params = useParams<{ id: string }>();
  const { me, userData } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>('');

  const handleCommentChange = (value?: string) => {
    setComment(value!);
  };

  //댓글 입력
  const handleComment = useMutation({
    mutationFn: async (userComment: any) => {
      const response = await fetch(`/api/posts/forum-detail/forum-comments/${params.id}`, {
        method: 'POST',
        body: JSON.stringify({ userComment })
      });
      const result = await response.json();
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['forumComments', params.id] });
      await queryClient.invalidateQueries({ queryKey: ['myComments'] });
      if (comment) {
        setComment('');
        revalidatePostTag(`forum-detail-${params.id}`);
      }
    }
  });

  //댓글 등록 onClick 함수
  const handleCommentClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    const forumComment = { user_id: me?.id, post_id: params.id, comment };

    if (!me?.id) {
      toast.error('로그인 후 입력가능합니다.', {
        autoClose: 2000
      });
      return;
    }

    toast.success(COMMENT_POST_ALERT_TEXT);
    handleComment.mutate(forumComment);
  };

  return (
    <div className={`flex ${me ? 'justify-start' : 'justify-center'} items-center px-5 pb-5 md:pb-0 md:px-0  md:py-6`}>
      <div className=" w-full">
        <div className=" flex justify-center items-center gap-6">
          {me && (
            <Image
              src={userData?.profile_image ?? ''}
              alt="user profile image"
              width={48}
              height={48}
              className=" rounded-full hidden md:block md:w-12 md:h-12 "
            />
          )}
          <MDEditor
            value={comment}
            onChange={handleCommentChange}
            preview="edit"
            extraCommands={commands.getCommands().filter(() => false)}
            commands={commands.getCommands().filter((command) => {
              return command.name !== 'image';
            })}
            textareaProps={{
              placeholder: `${me ? '자유롭게 소통해 보세요!' : '로그인 후 자유롭게 소통해 보세요!'}`,
              maxLength: 1000
            }}
            className="w-full border  border-neutral-100  first-of-type:rounded-xl focus-within:border-main-400"
          />
        </div>
        {me && (
          <div className=" flex justify-end items-end gap-6 mt-6">
            {comment === '' ? (
              <>
                <Chip intent="gray_disabled" size="medium" label="취소" />
                <Chip intent="primary_disabled" size="medium" label="등록" />
              </>
            ) : (
              <>
                <Chip
                  intent="gray"
                  size="medium"
                  label="취소"
                  onClick={() => {
                    setComment('');
                  }}
                />
                <Chip intent="primary" size="medium" label="등록" onClick={handleCommentClick} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputComments;
