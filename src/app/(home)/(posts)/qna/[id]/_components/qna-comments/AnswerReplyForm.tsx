import { revalidatePostTag } from '@/actions/revalidatePostTag';
import Chip from '@/components/common/Chip';
import ConfirmModal from '@/components/modal/ConfirmModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import { ALERT_AUTO_CLOSE_TIME, COMMENT_POST_ALERT_TEXT } from '@/constants/alert';
import { COMMENT_CANCLE_CONFIRM_TEXT } from '@/constants/confirmModal';

import { useAuth } from '@/context/auth.context';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

type AnswerRepliesFormProps = {
  commentId: string;
  setReplyCount: Dispatch<SetStateAction<number>>;
};

const AnswerReplyForm = ({ commentId, setReplyCount }: AnswerRepliesFormProps) => {
  const { me, userData } = useAuth();
  const [content, setContent] = useState<string>('');
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const { postId } = useQnaDetailStore();
  const handleChangeContent = (value?: string) => {
    setContent(value!);
  };
  const queryClient = useQueryClient();

  const handleLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handlePostingReply = async () => {
    if (!me?.id) return;
    else if (content.length === 0) {
      return toast.error('내용을 입력해주세요!');
    }
    const data = await addAnswerReply({ user_id: me?.id, reply: content });
    toast.success(COMMENT_POST_ALERT_TEXT, { autoClose: ALERT_AUTO_CLOSE_TIME, hideProgressBar: true });
    setContent('');
    setReplyCount((prev) => prev + 1);
    await revalidatePostTag(`qna-detail-${postId}`);
    return;
  };

  const postingAnswerReply = async ({ user_id, reply }: { user_id: string; reply: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/qna-reply/${commentId}`, {
      method: 'POST',
      body: JSON.stringify({ user_id, reply })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }

    return data;
  };

  const { mutate: addAnswerReply } = useMutation({
    mutationFn: postingAnswerReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qnaReply', commentId] });
    }
  });

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

  return (
    <div className="py-6  w-[1156px]  flex flex-col border-y " onClick={me?.id ? () => {} : handleLoginModal}>
      {isLoginModalOpen ? <LoginAlertModal /> : null}
      <div className="flex items-center gap-4 mb-6 h-44">
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
      <div className="ml-auto flex gap-4">
        <ConfirmModal
          isOpen={isSelectModalOpen}
          onClose={handleCancleModalCancle}
          onConfirm={handleCancleModalApprove}
          message={COMMENT_CANCLE_CONFIRM_TEXT}
        />

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
    </div>
  );
};

export default AnswerReplyForm;
