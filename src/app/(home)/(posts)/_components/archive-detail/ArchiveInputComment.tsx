'use client';

import { revalidate } from '@/actions/revalidate';
import { useAuth } from '@/context/auth.context';
import { userComment } from '@/types/posts/archiveDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/modal/ConfirmModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';

const ArchiveInputComments = () => {
  const params = useParams<{ id: string }>();
  const { me, userData } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleCommentChange = (value?: string) => {
    setComment(value ?? '');
  };
  const handleLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const handleComment = useMutation({
    mutationFn: async (userComment: userComment) => {
      const response = await fetch(`/api/posts/archive-detail/archive-comments/${params.id}`, {
        method: 'POST',
        body: JSON.stringify({ userComment })
      });
      const result = await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveComments'] });
      if (comment) {
        setComment('');
        revalidate('/', 'page');
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const archiveComment = { user_id: me?.id, post_id: params.id, comment };

    if (!me?.id) {
      toast.error('로그인 후 입력 가능합니다.', {
        autoClose: 2000
      });
      return;
    }
    if (comment === '') {
      toast.error('댓글을 입력해주세요!', {
        autoClose: 2000
      });
      return;
    }

    handleComment.mutate(archiveComment);
  };

  const handleCancelClick = () => {
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    setComment('');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="py-6  w-[1156px]  flex flex-col border-y " onClick={me?.id ? () => {} : handleLoginModal}>
      {isLoginModalOpen ? <LoginAlertModal /> : null}
      <div className={`flex ${me ? 'justify-start' : 'justify-center'} items-center  py-6`}>
        {me ? (
          <form className=" w-full" onSubmit={handleSubmit}>
            <div className=" flex justify-center items-center gap-6">
              <Image
                src={userData?.profile_image ?? ''}
                alt="user profile image"
                width={48}
                height={48}
                className=" rounded-full"
              />
              <MDEditor
                value={comment}
                onChange={handleCommentChange}
                preview="edit"
                extraCommands={commands.getCommands().filter(() => false)}
                commands={commands.getCommands().filter((command) => {
                  return command.name !== 'image';
                })}
                textareaProps={{ placeholder: '자유롭게 소통해 보세요!', maxLength: 1000 }}
                className="w-full "
              />
            </div>
            <div className=" flex justify-end items-end gap-6 mt-6">
              <button
                type="button"
                disabled={!comment}
                className={`${comment ? 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-500' : 'bg-neutral-50 text-neutral-100'}   px-5 py-3 rounded-lg text-subtitle1 font-bold`}
                onClick={() => {
                  setComment('');
                }}
              >
                취소
              </button>
              <button
                className={`${comment ? 'bg-main-400 text-white hover:bg-main-500 hover:text-white' : 'bg-main-100 text-main-50'}  px-5 py-3 rounded-lg text-subtitle1 font-bold`}
                disabled={!comment}
              >
                등록
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center	">로그인 후 이용이 가능합니다.</p>
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
    </div>
  );
};

export default ArchiveInputComments;
