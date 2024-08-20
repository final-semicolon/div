'use client';

import { revalidate } from '@/actions/revalidate';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import { useAuth } from '@/context/auth.context';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { userComment } from '@/types/posts/archiveDetailTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ArchiveInputComments = ({
  setCommentCount
}: {
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const params = useParams<{ id: string }>();
  const { me, userData } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>('');
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['archiveComments'] });
      await queryClient.invalidateQueries({ queryKey: ['myArchiveComments'] });
      if (comment) {
        setComment('');
        await revalidate('/', 'layout');
        setCommentCount((prev) => prev + 1);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const archiveComment = { user_id: me?.id, post_id: params.id, comment };

    if (!me?.id) {
      toast.error('로그인 후 입력해주세요', {
        autoClose: 2000
      });
      return;
    }
    if (comment === '') {
      toast.error('댓글을 입력해주세요', {
        autoClose: 2000
      });
      return;
    }

    toast.success('댓글을 등록했어요', { autoClose: 1500 });
    handleComment.mutate(archiveComment);
  };

  return (
    <>
      <Default>
        <div className="py-6 w-[1156px] flex flex-col" onClick={me?.id ? () => {} : handleLoginModal}>
          {isLoginModalOpen ? <LoginAlertModal /> : ''}
          <form className=" w-full" onSubmit={handleSubmit}>
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
              <div className="border border-neutral-100 rounded-xl focus-within:border-main-400">
                {me?.id ? (
                  <MDEditor
                    value={comment}
                    onChange={handleCommentChange}
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
            {me && (
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
            )}
          </form>
        </div>
      </Default>
      <Mobile>
        <div className="p-5 flex flex-col border-t-[1px] border-y" onClick={me?.id ? () => {} : handleLoginModal}>
          {isLoginModalOpen ? <LoginAlertModal /> : ''}
          <form className=" w-full" onSubmit={handleSubmit}>
            <div className="flex items-center mb-5">
              <div className="border border-neutral-100 rounded-xl focus-within:border-main-400">
                {me?.id ? (
                  <MDEditor
                    value={comment}
                    onChange={handleCommentChange}
                    height={120}
                    style={{ width: '350px' }}
                    preview="edit"
                    extraCommands={commands.getCommands().filter(() => false)}
                    textareaProps={{ maxLength: 1000, placeholder: '자유롭게 소통해 보세요!' }}
                  />
                ) : (
                  <MDEditor
                    height={120}
                    style={{ width: '350px' }}
                    preview="edit"
                    extraCommands={commands.getCommands().filter(() => false)}
                    textareaProps={{ maxLength: 0, placeholder: '로그인 후 자유롭게 소통해 보세요!' }}
                  />
                )}
              </div>
            </div>
            {me && (
              <div className=" flex justify-end items-end gap-4">
                <button
                  type="button"
                  disabled={!comment}
                  className={`${comment ? 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-500' : 'bg-neutral-50 text-neutral-100'} h-[35px] w-[57px] rounded-lg 
                  subtitle3-bold-14px`}
                  onClick={() => {
                    setComment('');
                  }}
                >
                  취소
                </button>
                <button
                  className={`${comment ? 'bg-main-400 text-white hover:bg-main-500 hover:text-white' : 'bg-main-100 text-main-50'} h-[35px] w-[57px] rounded-lg subtitle3-bold-14px`}
                  disabled={!comment}
                >
                  등록
                </button>
              </div>
            )}
          </form>
        </div>
      </Mobile>
    </>
  );
};

export default ArchiveInputComments;
