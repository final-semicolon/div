import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useState } from 'react';
import { InvalidateQueryFilters } from '@tanstack/react-query';
import useAddMutation from './useAddMutation';

type useReplyFormProps = {
  commentId?: string;
  userId: string;
  replyType: 'question' | 'answer';
};

const useReplyForm = ({ commentId, userId, replyType }: useReplyFormProps) => {
  const { postId } = useQnaDetailStore();
  const [content, setContent] = useState<string>('');
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const addMutationObj = {
    answer: { path: `/qna-reply/${commentId}`, queryKey: ['qnaReply', commentId] as InvalidateQueryFilters },
    question: { path: `/qna-post-reply/${postId}`, queryKey: ['qnaReply', postId] as InvalidateQueryFilters }
  };

  const path = addMutationObj[`${replyType}`].path;
  const querykey = addMutationObj[`${replyType}`].queryKey;

  const { postingReply } = useAddMutation({ content, path, querykey, commentId, userId, postId });

  const handleChangeContent = (value?: string) => {
    setContent(value!);
  };

  const handleOpenCancleModal = (): void => {
    if (content.length === 0) return;
    setIsSelectModalOpen(true);
  };

  const handleCancleModalCancle = (): void => {
    setIsSelectModalOpen(false);
  };

  const handleCancleModalApprove = (): void => {
    setContent('');
    setIsSelectModalOpen(false);
  };

  const handleLoginModal = (): void => {
    setIsLoginModalOpen(true);
  };

  const handlePostingReply = (): void => {
    if (!userId) return;
    postingReply();
    setContent('');
    return;
  };

  return {
    content,
    isSelectModalOpen,
    isLoginModalOpen,
    handleChangeContent,
    handleOpenCancleModal,
    handleCancleModalCancle,
    handleCancleModalApprove,
    handleLoginModal,
    handlePostingReply
  };
};

export default useReplyForm;
