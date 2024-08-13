import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type useEditReplyMutationProps = {
  commentId?: string;
  postId: string;
  path: string;
  queryKey: InvalidateQueryFilters;
  content: string;
};

const useEditReplyMutation = ({ commentId, postId, path, queryKey, content }: useEditReplyMutationProps) => {
  const queryClient = useQueryClient();
  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail`;

  const editReply = (): void => {
    editMutate({ reply: content });
    return;
  };

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
      await queryClient.invalidateQueries(queryKey);
      toast.success(COMMENT_EDIT_ALERT_TEXT);
      await revalidatePostTag(`qna-detail-${postId}`);
    }
  });

  return { editReply };
};

export default useEditReplyMutation;
