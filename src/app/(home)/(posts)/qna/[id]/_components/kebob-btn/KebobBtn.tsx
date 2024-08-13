import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { COMMENT_DELETE_CONFIRM_TEXT, POST_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { Dispatch, SetStateAction } from 'react';
import useKebob from '../../_hooks/useKebob';

type QuestionReplyKebobBtnProps = {
  commentId?: string;
  replyId?: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  category: 'answer' | 'questionReply' | 'answerReply';
};

const KebobBtn = ({ commentId, replyId, setIsEdit, category }: QuestionReplyKebobBtnProps) => {
  const { openKebab, isModalOpen, closeModal, handleEditClick, handleDeleteClick, handleKebobClick, handleDeleteData } =
    useKebob({ commentId, replyId, setIsEdit, category });

  return (
    <>
      <div className="relative">
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteData}
          message={category === 'answer' ? POST_DELETE_CONFIRM_TEXT : COMMENT_DELETE_CONFIRM_TEXT}
        />
        <button className="mb-[6px]" onClick={handleKebobClick}>
          <KebabButton />
        </button>
        <ul
          className={`${openKebab ? 'border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute -right-[6px] text-center hover:border-main-400 text-body2 z-10`}
        >
          <li
            className={`content-center ${openKebab ? '' : 'hidden'} ${category === 'answer' ? ' px-4 py-[10px] w-[73px]' : 'px-[23px] py-[10px] w-[59px]'} box-content h-6 hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={handleEditClick}
          >
            {category === 'answer' ? '게시글 수정' : '댓글 수정'}
          </li>
          <li
            className={` content-center ${openKebab ? '' : 'hidden'} ${category === 'answer' ? ' px-4 py-[10px] w-[73px]' : 'px-[23px] py-[10px] w-[59px]'}  box-content h-6 hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
            onClick={handleDeleteClick}
          >
            {category === 'answer' ? '게시글 삭제' : '댓글 삭제'}
          </li>
        </ul>
      </div>
    </>
  );
};

export default KebobBtn;
