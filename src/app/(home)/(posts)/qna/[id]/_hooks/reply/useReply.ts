import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useState } from 'react';
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

  const handleContentChange = (value: string | undefined): void => {
    setContent(value!);
  };

  const handleCancleClick = () => {
    setIsEdit(false);
    setContent(replyContent);
  };

  const handleSeeMoreClick = () => {
    setSeeMore(true);
  };

  const handleEditReply = () => {
    if (content.length === 0) {
      return;
    }
    editReply();
    setIsEdit(false);
  };

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
