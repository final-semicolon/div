import { revalidatePostTag } from '@/actions/revalidatePostTag';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { POST_DELETE_ALERT_TEXT } from '@/constants/alert';
import { EDIT_MOVE_CONFIRM_TEXT, POST_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const QuestionKebobBtn = () => {
  const queryClient = useQueryClient();
  const { postId } = useQnaDetailStore();
  const router = useRouter();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleKebobClick = (): void => {
    setOpenKebab((prev) => !prev);
  };
  const handleDeleteClick = (): void => {
    setIsDeleteModalOpen(true);
  };
  const handleEditClick = (): void => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = (): void => {
    setIsEditModalOpen(false);
  };
  const closeDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  const moveEditPage = (): void => {
    router.push(`/edit/${postId}/?category=qna`);
  };

  const deletePost = async (): Promise<void> => {
    const response = await fetch(`/api/posts/qna-detail/question/${postId}`, {
      method: 'DELETE'
    });
    const { data, message } = await response.json();
    if (message) {
      toast.error(message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
    await revalidatePostTag(`qna-detail-${postId}`);
    toast.success(POST_DELETE_ALERT_TEXT);
    router.push(`/qna`);
    return;
  };

  return (
    <>
      <div className="relative ml-auto ">
        <button className="px-[10px]" onClick={handleKebobClick}>
          <KebabButton />
        </button>

        <ul
          className={`${openKebab ? ' border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute  -right-[6px] text-center hover:border-main-400 text-body4 md:text-body2 z-50`}
        >
          <ConfirmModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onConfirm={moveEditPage}
            message={EDIT_MOVE_CONFIRM_TEXT}
          />
          <li
            className={` content-center ${openKebab ? '' : 'hidden'} box-content px-2 py-2 md:px-4 md:py-[10px] w-[66px] md:w-[73px] md:h-6  hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={handleEditClick}
          >
            게시글 수정
          </li>

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={deletePost}
            message={POST_DELETE_CONFIRM_TEXT}
          />

          <li
            className={` content-center ${openKebab ? '' : 'hidden'}box-content px-2 py-2 md:px-4 md:py-[10px] w-[66px] md:w-[73px] md:h-6 hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
            onClick={handleDeleteClick}
          >
            게시글 삭제
          </li>
        </ul>
      </div>
    </>
  );
};

export default QuestionKebobBtn;
