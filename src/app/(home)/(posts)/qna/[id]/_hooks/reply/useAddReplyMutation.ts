import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_POST_ALERT_TEXT } from '@/constants/alert';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { TqnaCommentsWithReplyCount, TqnaReplyWithUser, Treply } from '@/types/posts/qnaDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type useAddMutationProps = {
  content: string;
  path: string;
  queryKey: string[];
  commentId?: string;
  userId: string;
  postId: string;
};

const useAddMutation = ({ content, path, queryKey, commentId, userId, postId }: useAddMutationProps) => {
  const queryClient = useQueryClient();
  const { commentPage } = useQnaDetailStore();
  const BASE_URL = `/api/posts/qna-detail`;

  const postReplyMutation = async ({
    user_id,
    content
  }: {
    user_id: string;
    content: string;
  }): Promise<(Treply[] & { count: number }) | (TqnaReplyWithUser[] & { count: number }) | void> => {
    const response = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST',
      body: commentId
        ? JSON.stringify({ user_id, reply: content })
        : JSON.stringify({ user_id, post_reply_content: content })
    });
    const { data, message } = await response.json();
    if (message) {
      toast.error(message);
      return;
    }
    return data;
  };

  const { mutate: postReplyMutate } = useMutation({
    mutationFn: postReplyMutation,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey });

      if (commentId) {
        await queryClient.setQueryData(
          ['qnaComments', postId, commentPage],
          (oldComments: TqnaCommentsWithReplyCount[]) => {
            return oldComments.map((oldComment) =>
              oldComment.id === commentId ? { ...oldComment, qna_reply: [{ count: data?.count }] } : oldComment
            );
          }
        );
      }
      if (path.includes('qna-post-reply')) {
        await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
      }
      toast.success(COMMENT_POST_ALERT_TEXT);
      path.includes('qna-post-reply') ? await revalidatePostTag(`qna-detail-${postId}`) : '';
    }
  });

  const postingReply = useCallback(() => {
    postReplyMutate({ user_id: userId, content });
    return;
  }, [userId, content, postReplyMutate]);

  return { postingReply };
};

export default useAddMutation;
