import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useCallback, useState } from 'react';
import useAddMutation from './useAddReplyMutation';

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

  const path = replyType === 'answer' ? `/qna-reply/${commentId}` : `/qna-post-reply/${postId}`;
  const queryKey = ['qnaReply', commentId ? commentId : postId];

  const { postingReply } = useAddMutation({ content, path, queryKey, commentId, userId, postId });

  const handleChangeContent = useCallback((value?: string) => {
    setContent(value!);
  }, []);

  const handleOpenCancleModal = useCallback((): void => {
    if (content.length === 0) return;
    setIsSelectModalOpen(true);
  }, [content.length]);

  const handleCancleModalCancle = useCallback((): void => {
    setIsSelectModalOpen(false);
  }, []);

  const handleCancleModalApprove = useCallback((): void => {
    setContent('');
    setIsSelectModalOpen(false);
  }, []);

  const handleLoginModal = useCallback((): void => {
    setIsLoginModalOpen(true);
  }, []);

  const handlePostingReply = useCallback((): void => {
    if (!userId) return;
    postingReply();
    setContent('');
    return;
  }, [userId, postingReply]);

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
