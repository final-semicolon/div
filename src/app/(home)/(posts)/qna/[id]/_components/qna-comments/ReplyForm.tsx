import Chip from '@/components/common/Chip';
import ConfirmModal from '@/components/modal/ConfirmModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import { COMMENT_CANCLE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { useAuth } from '@/context/auth.context';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import useReplyForm from '../../_hooks/reply/useReplyForm';

type ReplyFormProps = {
  commentId?: string;
};

const ReplyForm = ({ commentId }: ReplyFormProps) => {
  const { me, userData } = useAuth();
  const {
    content,
    isSelectModalOpen,
    isLoginModalOpen,
    handleChangeContent,
    handleOpenCancleModal,
    handleCancleModalCancle,
    handleCancleModalApprove,
    handleLoginModal,
    handlePostingReply
  } = useReplyForm({ commentId, userId: me?.id ?? '', replyType: commentId ? 'answer' : 'question' });

  return (
    <div
      className="my-[21.5px]  md:my-0 py-5 md:py-6 md:max-w-[1156px] flex flex-col border-b md:border-y"
      onClick={me?.id ? () => {} : handleLoginModal}
    >
      {isLoginModalOpen ? <LoginAlertModal /> : ''}
      <ConfirmModal
        isOpen={isSelectModalOpen}
        onClose={handleCancleModalCancle}
        onConfirm={handleCancleModalApprove}
        message={COMMENT_CANCLE_CONFIRM_TEXT}
      />
      <div className=" flex items-center gap-4 mb-6 ">
        {me?.id ? (
          <div className="relative w-12 h-12 hidden md:block">
            <Image
              src={userData?.profile_image ?? ''}
              alt="Profile"
              fill
              className="rounded-full"
              sizes="48px,48px"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="w-full max-h-[116px] md:max-h-[176px] border border-neutral-100 rounded-lg md:rounded-xl focus-within:border-main-400 ">
          {me?.id ? (
            <MDEditor
              value={content}
              onChange={handleChangeContent}
              height={176}
              preview="edit"
              commands={commands.getCommands().filter((command) => {
                return command.name !== 'image' && command.name !== 'help';
              })}
              extraCommands={commands.getCommands().filter(() => false)}
              textareaProps={{ maxLength: 1000, placeholder: '자유롭게 소통해 보세요!' }}
            />
          ) : (
            <MDEditor
              height={176}
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

export default ReplyForm;
