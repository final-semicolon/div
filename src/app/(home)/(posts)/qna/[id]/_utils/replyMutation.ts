import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type replyMutationProps = {
  postId: string;
  replyId: string;
  commentId?: string;
};
//commentID가 있으면 답변글 댓글
const replyMutation = ({ replyId, postId, commentId }: replyMutationProps) => {
  const queryClient = useQueryClient();
  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail`;
  const path = commentId ? `/qna-reply/${replyId}` : `/qna-post-reply/${replyId}`;
  const querykey = commentId ? { queryKey: ['qnaReply', commentId] } : { queryKey: ['qnaReply', postId] };

  const deleteReply = async (): Promise<void> => {
    if (!replyId) return;
    const data = await deleteMutate();
    toast.success(COMMENT_DELETE_ALRERT_TEXT);
    await revalidatePostTag(`qna-detail-${postId}`);
    return;
  };

  const deleteReplyMutation = async () => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE'
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteReplyMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(querykey);
    }
  });

  return { deleteReply };
};

export default replyMutation;

//마찬가지지만 전달되는 Id값이 다른 점을 숙지해야함.
