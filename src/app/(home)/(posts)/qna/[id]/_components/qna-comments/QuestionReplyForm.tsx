import { revalidatePostTag } from '@/actions/revalidatePostTag';
import Chip from '@/components/common/Chip';
import ConfirmModal from '@/components/modal/ConfirmModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import { COMMENT_POST_ALERT_TEXT } from '@/constants/alert';
import { COMMENT_CANCLE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { useAuth } from '@/context/auth.context';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

const QuestionReplyForm = () => {
  const { postId } = useQnaDetailStore();
  const { me, userData } = useAuth();
  const [content, setContent] = useState<string>('');
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const handleChangeContent = (value?: string) => {
    setContent(value!);
  };

  const handleOpenCancleModal = () => {
    if (content.length === 0) return;
    setIsSelectModalOpen(true);
  };

  const handleCancleModalCancle = () => {
    setIsSelectModalOpen(false);
  };

  const handleCancleModalApprove = () => {
    setContent('');
    setIsSelectModalOpen(false);
  };

  const handleLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const queryClient = useQueryClient();

  const postingQuestionReply = async ({
    user_id,
    post_reply_content
  }: {
    user_id: string;
    post_reply_content: string;
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/qna-post-reply/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ user_id, post_reply_content })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const handlePostingReply = async () => {
    if (!me?.id || content.length === 0) return;
    else if (content.length === 0) {
      return toast.error('내용을 입력해주세요!');
    }
    const data = await addQuestionReply({ user_id: me?.id, post_reply_content: content });

    // setReplyCount((prev) => prev + 1);

    return;
  };

  const { mutate: addQuestionReply } = useMutation({
    mutationFn: postingQuestionReply,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qnaReply', postId] });
      toast.success(COMMENT_POST_ALERT_TEXT);
      setContent('');
      await revalidatePostTag(`qna-detail-${postId}`);
    }
  });

  return (
    <div className="py-6 w-[1156px] flex flex-col border-y" onClick={me?.id ? () => {} : handleLoginModal}>
      {isLoginModalOpen ? <LoginAlertModal /> : ''}
      <div className="flex items-center gap-4 mb-6">
        {me?.id ? (
          <div className="relative w-12 h-12">
            <Image
              src={userData?.profile_image ?? ''}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        ) : null}

        <ConfirmModal
          isOpen={isSelectModalOpen}
          onClose={handleCancleModalCancle}
          onConfirm={handleCancleModalApprove}
          message={COMMENT_CANCLE_CONFIRM_TEXT}
        />
        <div className="border border-neutral-100 rounded-xl focus-within:border-main-400">
          {me?.id ? (
            <MDEditor
              value={content}
              onChange={handleChangeContent}
              height={176}
              style={{ width: '1092px' }}
              preview="edit"
              extraCommands={commands.getCommands().filter(() => false)}
              textareaProps={{ maxLength: 1000, placeholder: '자유롭게 소통해 보세요!' }}
            />
          ) : (
            <MDEditor
              height={176}
              style={{ width: '1156px' }}
              preview="edit"
              extraCommands={commands.getCommands().filter(() => false)}
              textareaProps={{ maxLength: 0, placeholder: '로그인 후 자유롭게 소통해 보세요!' }}
            />
          )}
        </div>
      </div>
      {me?.id ? (
        <div className="ml-auto flex gap-4 ">
          <Chip
            type="button"
            intent={`${content.length === 0 ? 'gray_disabled' : 'gray'}`}
            size={'medium'}
            label="취소"
            onClick={handleOpenCancleModal}
          />
          <Chip
            type="button"
            intent={`${content.length === 0 ? 'primary_disabled' : 'primary'}`}
            size={'medium'}
            label="등록"
            onClick={handlePostingReply}
          />
        </div>
      ) : null}
    </div>
  );
};

export default QuestionReplyForm;
