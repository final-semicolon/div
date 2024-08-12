import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import replyMutation from '../_utils/replyMutation';
import { useQnaDetailStore } from '@/store/qnaDetailStore';

type useReplyKebobProps = {
  replyId: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  commentId?: string;
};

const useReplyKebob = ({ commentId, replyId, setIsEdit }: useReplyKebobProps) => {
  const { postId } = useQnaDetailStore();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { deleteReply } = replyMutation(commentId ? { commentId, replyId, postId } : { replyId, postId });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleKebobClick = (): void => {
    setOpenKebab((prev) => !prev);
  };

  const handleEditClick = (): void => {
    setIsEdit(true);
    setOpenKebab(false);
  };

  const handleDeleteClick = (): void => {
    openModal();
    setOpenKebab(false);
  };

  const handleDeleteReply = async () => {
    await deleteReply();
  };

  return {
    openKebab,
    isModalOpen,
    openModal,
    closeModal,
    handleEditClick,
    handleDeleteClick,
    handleKebobClick,
    handleDeleteReply
  };
};
export default useReplyKebob;
