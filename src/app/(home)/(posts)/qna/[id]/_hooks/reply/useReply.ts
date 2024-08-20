import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useCallback, useState } from 'react';
import useEditReplyMutation from './useEditReplyMutation';

type useReplyProps = {
  commentId?: string;
  replyId: string;
  replyContent: string;
  replyType: 'answer' | 'question';
};

const useReply = ({ commentId, replyId, replyContent, replyType }: useReplyProps) => {
  const { postId, postUser } = useQnaDetailStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [content, setContent] = useState<string>(replyContent);
  const [seeMore, setSeeMore] = useState<boolean>(false);

  const path = replyType === 'answer' ? `/qna-reply/${replyId}` : `/qna-post-reply/${replyId}`;
  const queryKey = ['qnaReply', commentId ? commentId : postId];

  const { editReply } = useEditReplyMutation({ commentId, postId, path, content, queryKey });

  const handleContentChange = useCallback((value: string | undefined): void => {
    setContent(value!);
  }, []);

  const handleCancleClick = useCallback(() => {
    setIsEdit(false);
    setContent(replyContent);
  }, [replyContent]);

  const handleSeeMoreClick = useCallback(() => {
    setSeeMore(true);
  }, []);

  const handleEditReply = useCallback(() => {
    if (content.length === 0) {
      return;
    }
    editReply();
    setIsEdit(false);
  }, [content.length, editReply]);

  return {
    postUser,
    isEdit,
    setIsEdit,
    content,
    seeMore,
    handleContentChange,
    handleCancleClick,
    handleSeeMoreClick,
    handleEditReply
  };
};

export default useReply;
