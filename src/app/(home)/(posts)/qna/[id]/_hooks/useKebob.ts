import { Dispatch, SetStateAction, useState } from 'react';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { InvalidateQueryFilters } from '@tanstack/react-query';
import useDeleteMutation from './useDeleteMutation';

type useReplyKebobProps = {
  replyId?: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  commentId?: string;
  category: 'answer' | 'questionReply' | 'answerReply';
};

const useKebob = ({ commentId, replyId, setIsEdit, category }: useReplyKebobProps) => {
  const { postId, commentPage } = useQnaDetailStore();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const deleteMutationObj = {
    answer: {
      path: `/comment/${commentId}`,
      queryKey: ['qnaComments', commentId, commentPage]
    },
    questionReply: { path: `/qna-post-reply/${replyId}`, queryKey: ['qnaReply', postId] },
    answerReply: { path: `/qna-reply/${replyId}`, queryKey: ['qnaReply', commentId] }
  };

  const path = deleteMutationObj[`${category}`].path;
  const queryKey = deleteMutationObj[`${category}`].queryKey as (string | number)[];

  const { deleteQnaData } = useDeleteMutation({ path, queryKey, postId, commentId });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleKebobClick = () => {
    setOpenKebab((prev) => !prev);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setOpenKebab(false);
  };

  const handleDeleteClick = () => {
    openModal();
    setOpenKebab(false);
  };

  const handleDeleteData = () => {
    deleteQnaData();
  };

  return {
    openKebab,
    isModalOpen,
    openModal,
    closeModal,
    handleEditClick,
    handleDeleteClick,
    handleKebobClick,
    handleDeleteData
  };
};
export default useKebob;
