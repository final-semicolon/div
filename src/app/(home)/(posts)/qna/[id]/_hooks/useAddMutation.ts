import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_DELETE_ALRERT_TEXT, COMMENT_POST_ALERT_TEXT, QNA_ANSWER_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type useAddMutationProps = {
  content: string;
  path: string;
  querykey: InvalidateQueryFilters;
  commentId?: string;
  userId: string;
  postId: string;
};

const useAddMutation = ({ content, path, querykey, commentId, userId, postId }: useAddMutationProps) => {
  const queryClient = useQueryClient();
  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail`;

  const postingReply = (): void => {
    postReplyMutate({ user_id: userId, content });
    return;
  };

  const postReplyMutation = async ({ user_id, content }: { user_id: string; content: string }) => {
    const response = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST',
      body: commentId
        ? JSON.stringify({ user_id, reply: content })
        : JSON.stringify({ user_id, post_reply_content: content })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const { mutate: postReplyMutate } = useMutation({
    mutationFn: postReplyMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries(querykey);
      toast.success(COMMENT_POST_ALERT_TEXT);
      await revalidatePostTag(`qna-detail-${postId}`);
    }
  });

  return { postingReply };
};

export default useAddMutation;
