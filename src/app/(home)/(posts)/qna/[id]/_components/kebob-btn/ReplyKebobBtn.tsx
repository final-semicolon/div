import { revalidatePostTag } from '@/actions/revalidatePostTag';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { COMMENT_DELETE_ALRERT_TEXT } from '@/constants/alert';
import { COMMENT_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import useReplyKebob from '../../_hooks/useReplyKebob';

type QuestionReplyKebobBtnProps = {
  commentId?: string;
  replyId: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

const ReplyKebobBtn = ({ commentId, replyId, setIsEdit }: QuestionReplyKebobBtnProps) => {
  const {
    openKebab,
    isModalOpen,
    closeModal,
    handleEditClick,
    handleDeleteClick,
    handleKebobClick,
    handleDeleteReply
  } = useReplyKebob(
    commentId
      ? { commentId, replyId, setIsEdit }
      : {
          replyId,
          setIsEdit
        }
  );

  return (
    <>
      <div className="relative">
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteReply}
          message={COMMENT_DELETE_CONFIRM_TEXT}
        />
        <button className="mb-[6px]" onClick={handleKebobClick}>
          <KebabButton />
        </button>
        <ul
          className={`${openKebab ? 'border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute -right-[6px] text-center hover:border-main-400 text-body2 z-10`}
        >
          <li
            className={`content-center ${openKebab ? '' : 'hidden'} px-[23px] py-[10px] box-content w-[59px] h-6  hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={handleEditClick}
          >
            댓글 수정
          </li>
          <li
            className={` content-center ${openKebab ? '' : 'hidden'} px-[23px] py-[10px] box-content w-[59px] h-6  hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
            onClick={handleDeleteClick}
          >
            댓글 삭제
          </li>
        </ul>
      </div>
    </>
  );
};
//여기도 문제인데..근데 둘이 똑같은 UI아니냐는거지
export default ReplyKebobBtn;
