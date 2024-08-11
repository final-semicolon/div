'use client';

import { useAuth } from '@/context/auth.context';
import { archiveReplyInputProps, userReply } from '@/types/posts/archiveDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/modal/ConfirmModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';

const ArchiveReplyInput = ({ comment_id, toggle, count }: archiveReplyInputProps) => {
  const { me, userData } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState(''); //
  const [showModal, setShowModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleReply = useMutation({
    mutationFn: async (userReply: userReply) => {
      const response = await fetch(`/api/posts/archive-detail/archive-reply/${params.id}`, {
        method: 'POST',
        body: JSON.stringify(userReply),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentReply'] });
      queryClient.invalidateQueries({ queryKey: ['archiveCommentReply'] });
    }
  });
  const handleLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  //
  const changeReply = (value?: string) => {
    setReply(value ?? '');
  };

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const archiveCommentReply: userReply = { user_id: me?.id, comment_id, reply };

    if (!me?.id) {
      toast.error('로그인 후 입력 가능합니다.', {
        autoClose: 2000
      });
      return;
    }
    if (!reply) {
      toast.error('댓글을 입력해주세요.', {
        autoClose: 2000
      });
      return;
    }

    setReply('');
    handleReply.mutate(archiveCommentReply);
  };

  const handleCancelClick = () => {
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    toggle(comment_id, count);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="py-6  w-[1156px]  flex flex-col border-y " onClick={me?.id ? () => {} : handleLoginModal}>
      {isLoginModalOpen ? <LoginAlertModal /> : null}
      {me ? (
        <div>
          <p>댓글 {count}</p>
          <div className="flex justify-center items-center gap-6">
            <Image
              src={userData?.profile_image ?? ''}
              alt="user profile image"
              width={48}
              height={48}
              className="rounded-full"
            />
            <MDEditor
              value={reply}
              onChange={changeReply}
              preview="edit"
              extraCommands={commands.getCommands().filter(() => false)}
              commands={commands.getCommands().filter((command) => {
                return command.name !== 'image';
              })}
              textareaProps={{ maxLength: 500 }}
              className="w-full "
            />
          </div>
          <div className="flex justify-end items-end gap-4 mt-4">
            <button
              onClick={handleCancelClick}
              disabled={!reply}
              className={`${reply ? 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-500' : 'bg-neutral-50 text-neutral-100'}  px-5 py-3 rounded-lg text-subtitle1 font-bold`}
            >
              취소
            </button>
            <button
              onClick={onClickReply}
              className={`${reply ? 'bg-main-400 text-white hover:bg-main-500 hover:text-white' : 'bg-main-100 text-main-50'}  px-5 py-3 rounded-lg text-subtitle1 font-bold`}
            >
              등록
            </button>
          </div>
        </div>
      ) : (
        <p className=" text-center">로그인 후 이용이 가능합니다.</p>
      )}
      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmCancel}
          message={'댓글 작성을 취소 하시겠습니까?'}
        />
      )}
    </div>
  );
};

export default ArchiveReplyInput;
