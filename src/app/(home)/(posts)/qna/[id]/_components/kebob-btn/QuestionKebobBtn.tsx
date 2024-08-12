import { revalidatePostTag } from '@/actions/revalidatePostTag';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { POST_DELETE_ALERT_TEXT } from '@/constants/alert';
import { POST_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';

import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useState } from 'react';
import { toast } from 'react-toastify';

const QuestionKebobBtn = () => {
  const router = useRouter();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const { postId } = useQnaDetailStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteClick: MouseEventHandler = () => {
    setIsDeleteModalOpen(true);
  };

  const deletePost = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/${postId}`, {
      method: 'DELETE'
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    await revalidatePostTag(`qna-detail-${postId}`);
    toast.success(POST_DELETE_ALERT_TEXT, { hideProgressBar: true });
    router.push(`/qna`);
    return;
  };

  return (
    <>
      <div className=" relative">
        <button
          onClick={() => {
            setOpenKebab((prev) => !prev);
          }}
        >
          <KebabButton />
        </button>

        <ul
          className={`${openKebab ? 'border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute  -right-[6px] text-center hover:border-main-400 text-body2`}
        >
          <ConfirmModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
            }}
            onConfirm={() => {
              router.push(`/edit/${postId}/?category=qna`);
            }}
            message={'수정 페이지로 이동하시겠습니까?'}
          />
          <li
            className={` content-center ${openKebab ? '' : 'hidden'} box-content px-4 py-[10px] w-[73px] h-6  hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={() => setIsEditModalOpen(true)}
          >
            게시글 수정
          </li>

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
            }}
            onConfirm={deletePost}
            message={POST_DELETE_CONFIRM_TEXT}
          />

          <li
            className={` content-center ${openKebab ? '' : 'hidden'}box-content px-4 py-[10px] w-[73px] h-6 hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
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
