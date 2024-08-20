import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_DELETE_ALRERT_TEXT, QNA_ANSWER_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { TqnaCommentsWithReplyCount } from '@/types/posts/qnaDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type replyMutationProps = {
  path: string;
  queryKey: (string | number)[];
  postId: string;
  commentId?: string;
};

const useDeleteMutation = ({ path, queryKey, postId, commentId }: replyMutationProps) => {
  const { commentPage } = useQnaDetailStore();
  const queryClient = useQueryClient();
  const BASE_URL = `/api/posts/qna-detail`;

  const deleteMutation = async () => {
    const response = await fetch(`${BASE_URL}${path}?commentId=${commentId} `, {
      method: 'DELETE'
    });
    const { count, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return count;
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteMutation,
    onSuccess: async (count) => {
      await queryClient.invalidateQueries({ queryKey });

      if (path.includes('reply')) {
        await queryClient.setQueryData(
          ['qnaComments', postId, commentPage],
          (oldComments: TqnaCommentsWithReplyCount[]) => {
            return oldComments.map((oldComment) =>
              oldComment.id === commentId ? { ...oldComment, qna_reply: [{ count }] } : oldComment
            );
          }
        );
      }

      if (path.includes('qna-post-reply')) {
        await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
        await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      } else if (path.includes('comment')) {
        await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
        await queryClient.invalidateQueries({ queryKey: ['myComments'] });
      }
      path.includes('reply') ? toast.success(COMMENT_DELETE_ALRERT_TEXT) : toast.success(QNA_ANSWER_DELETE_ALRERT_TEXT);
      !path.includes('qna-reply') ? await revalidatePostTag(`qna-detail-${postId}`) : '';
    }
  });

  const deleteQnaData = useCallback((): void => {
    deleteMutate();
    return;
  }, [deleteMutate]);

  return { deleteQnaData };
};

export default useDeleteMutation;
