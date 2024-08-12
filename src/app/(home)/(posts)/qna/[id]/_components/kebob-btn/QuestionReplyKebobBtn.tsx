import { revalidatePostTag } from '@/actions/revalidatePostTag';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { COMMENT_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { COMMENT_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';

import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

type QuestionReplyKebobBtnProps = {
  replyId: string;
  setReplyCount: Dispatch<SetStateAction<number>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

const QuestionReplyKebobBtn = ({ replyId, setReplyCount, setIsEdit }: QuestionReplyKebobBtnProps) => {
  const { postId } = useQnaDetailStore();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleDeleteClick: MouseEventHandler = () => {
    setIsDeleteModalOpen(true);
  };

  const deleteReply = async (): Promise<void> => {
    if (!replyId) return;
    const data = await deleteMutate({ replyId });
    toast.success(COMMENT_DELETE_ALRERT_TEXT, { hideProgressBar: true });
    setOpenKebab(false);
    setReplyCount((prev) => prev - 1);
    await revalidatePostTag(`qna-detail-${postId}`);
    return;
  };

  const deleteReplyMutation = async ({ replyId }: { replyId: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/qna-post-reply/${replyId}`, {
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
      queryClient.invalidateQueries({ queryKey: ['qnaReply', postId] });
    }
  });

  return (
    <>
      <div className="relative">
        <button
          className="mb-[6px]"
          onClick={() => {
            setOpenKebab((prev) => !prev);
          }}
        >
          <KebabButton />
        </button>
        <ul
          className={`${openKebab ? 'border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute -right-[6px] text-center hover:border-main-400 text-body2 z-10`}
        >
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
            }}
            onConfirm={deleteReply}
            message={COMMENT_DELETE_CONFIRM_TEXT}
          />
          <li
            className={`content-center ${openKebab ? '' : 'hidden'} px-[23px] py-[10px] box-content w-[59px] h-6  hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={() => {
              setIsEdit(true);
              setOpenKebab(false);
            }}
          >
            댓글 수정
          </li>
          <li
            className={` content-center ${openKebab ? '' : 'hidden'} px-[23px] py-[10px] box-content w-[59px] h-6  hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
            onClick={handleDeleteClick}
          >
            댓글 삭제
          </li>
        </ul>
      </div>
    </>
  );
};

export default QuestionReplyKebobBtn;
