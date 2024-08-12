import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { COMMENT_DELETE_ALRERT_TEXT, QNA_ANSWER_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type replyMutationProps = {
  path: string;
  querykey: InvalidateQueryFilters;
  postId: string;
};

const useDeleteMutation = ({ path, querykey, postId }: replyMutationProps) => {
  const queryClient = useQueryClient();
  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail`;

  const deleteQnaData = async (): Promise<void> => {
    await deleteMutate();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries(querykey);
      path.includes('reply') ? toast.success(COMMENT_DELETE_ALRERT_TEXT) : toast.success(QNA_ANSWER_DELETE_ALRERT_TEXT);
      await revalidatePostTag(`qna-detail-${postId}`);
    }
  });

  return { deleteQnaData };
};

export default useDeleteMutation;
