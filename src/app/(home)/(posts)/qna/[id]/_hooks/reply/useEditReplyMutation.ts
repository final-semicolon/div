import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type useEditReplyMutationProps = {
  commentId?: string;
  postId: string;
  path: string;
  queryKey: (string | number)[];
  content: string;
};

const useEditReplyMutation = ({ commentId, postId, path, queryKey, content }: useEditReplyMutationProps) => {
  const queryClient = useQueryClient();
  const BASE_URL = `/api/posts/qna-detail`;

  const editReplyMutation = async ({ reply }: { reply: string }) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      body: JSON.stringify(commentId ? { reply } : { post_reply_content: reply })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: editReplyMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success(COMMENT_EDIT_ALERT_TEXT);
    }
  });

  const editReply = useCallback((): void => {
    editMutate({ reply: content });
    return;
  }, [content, editMutate]);

  return { editReply };
};

export default useEditReplyMutation;
