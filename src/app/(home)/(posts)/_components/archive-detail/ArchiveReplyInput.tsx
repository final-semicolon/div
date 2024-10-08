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
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const ArchiveReplyInput = ({ comment_id, toggle, count }: archiveReplyInputProps) => {
  const { me, userData } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleReply = useMutation({
    mutationFn: async (userReply: userReply) => {
      const response = await fetch(`/api/posts/archive-detail/archive-reply/${params.id}`, {
        method: 'POST',
        body: JSON.stringify(userReply),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (newReply) => {
      queryClient.setQueryData(['archiveCommentReply', comment_id], (oldData: any) => {
        if (!oldData) {
          return { count: 1, reply: [newReply] };
        }

        return {
          ...oldData,
          count: oldData.count + 1,
          reply: [...(oldData.reply || []), newReply]
        };
      });
      queryClient.invalidateQueries({ queryKey: ['archiveCommentReply', comment_id] });
      queryClient.invalidateQueries({ queryKey: ['archiveComments'] });

      setReply('');
      toggle(comment_id, count + 1);
    }
  });

  const changeReply = (value?: string) => {
    setReply(value ?? '');
  };

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const archiveCommentReply: userReply = { user_id: me?.id, comment_id, reply };

    if (!me?.id) {
      toast.error('로그인 후 입력해주세요', {
        autoClose: 2000
      });
      return;
    }
    if (!reply) {
      toast.error('댓글을 입력해주세요', {
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
    <>
      <Default>
        <div className="border-l-4 border-[#C7DCF5] border-b-[1px] p-6">
          <p>댓글 {count}</p>
          <div className="flex justify-center items-center gap-6">
            <Image
              src={userData?.profile_image ?? ''}
              alt="user profile image"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="border border-neutral-100 rounded-xl focus-within:border-main-400">
              <MDEditor
                value={reply}
                onChange={changeReply}
                preview="edit"
                extraCommands={[]}
                commands={commands.getCommands().filter((command) => command.name !== 'image')}
                textareaProps={{ maxLength: 1000, placeholder: '자유롭게 소통해 보세요!' }}
                height={176}
                style={{ width: '1092px' }}
              />
            </div>
          </div>
          <div className="flex justify-end items-end gap-4 mt-4">
            <button
              onClick={handleCancelClick}
              className="bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-600 text-neutral-100 px-5 py-3 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={onClickReply}
              className={`px-5 py-3 rounded-lg ${
                reply ? 'bg-main-500 hover:bg-main-600 text-main-50' : 'bg-main-100 text-main-50'
              }`}
              disabled={!reply}
            >
              등록
            </button>
          </div>
          {showModal && (
            <ConfirmModal
              isOpen={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmCancel}
              message={'댓글 작성을 중단할까요?'}
            />
          )}
        </div>
      </Default>
      <Mobile>
        <div className="border-l-4 border-[#C7DCF5] border-b-[1px] py-5 p-6 mx-5">
          <div className="w-[287px] h-[19px] gap-[4px] mb-[20px]">
            <p>댓글 {count}</p>
          </div>
          <div className="flex justify-center items-center border border-neutral-100 rounded-xl focus-within:border-main-400">
            <MDEditor
              value={reply}
              onChange={changeReply}
              preview="edit"
              extraCommands={[]}
              commands={commands.getCommands().filter((command) => command.name !== 'image')}
              textareaProps={{ maxLength: 1000, placeholder: '자유롭게 소통해 보세요!' }}
              height={120}
              style={{ width: '335px' }}
            />
          </div>
          <div className="flex justify-end items-end gap-4 mt-4">
            <button
              onClick={handleCancelClick}
              className="bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-600 text-neutral-100 py-2 px-4 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={onClickReply}
              className={` py-2 px-4 rounded-lg ${
                reply ? 'bg-main-500 hover:bg-main-600 text-main-50' : 'bg-main-100 text-main-50'
              }`}
              disabled={!reply}
            >
              등록
            </button>
          </div>
          {showModal && (
            <ConfirmModal
              isOpen={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmCancel}
              message={'댓글 작성을 중단할까요?'}
            />
          )}
        </div>
      </Mobile>
    </>
  );
};

export default ArchiveReplyInput;
