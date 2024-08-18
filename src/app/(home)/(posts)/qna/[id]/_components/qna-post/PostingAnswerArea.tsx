import CustomMDEditor from '@/components/common/CustomMDEditor';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { TAG_LIST } from '@/constants/tags';
import SelectTagInput from '@/components/common/SelectTagInput';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Chip from '@/components/common/Chip';
import { QNA_ANSWER_ALERT_TEXT, QNA_ANSWER_CANCLE_ALRERT_TEXT } from '@/constants/alert';
import { POST_APPROVE_CONFIRM_TEXT, POST_CANCLE_CONFIRM_TEXT } from '@/constants/confirmModal';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { filterSlang } from '@/utils/markdownCut';
import X from '@/assets/images/common/X';

type PostingAnswerAreaProps = {
  title?: string;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setToggleAnswer: Dispatch<SetStateAction<boolean>>;
};
const PostingAnswerArea = ({ title, content, setContent, setToggleAnswer }: PostingAnswerAreaProps) => {
  const { me } = useAuth();
  const { postId } = useQnaDetailStore();
  const [isCancleModalOpen, setIsCancleModalOpen] = useState<boolean>(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [tagList, setTagList] = useState<Array<Ttag>>(TAG_LIST);
  const queryClient = useQueryClient();

  const handleCancleClick = useCallback(() => {
    setIsCancleModalOpen(true);
  }, []);

  const handleApproveClick = useCallback(() => {
    setIsApproveModalOpen(true);
  }, []);

  const postingAnswer = async (): Promise<void> => {
    if (!me?.id) return;
    addMutate({ user_id: me.id, content, tags: tagList.filter((tag) => tag.selected) });
    toast.success(QNA_ANSWER_ALERT_TEXT);
    return;
  };

  const postingAnswerMutation = async ({
    user_id,
    content,
    tags
  }: {
    user_id: string;
    content: string;
    tags: Ttag[];
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/comment/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ user_id, comment: content })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }

    if (data[0]) {
      const tagResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upsert/tags/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ comment_id: data[0]?.id, user_id: me?.id, tags: tags, category: 'comment' })
      });
      const { message } = await tagResponse.json();
    }

    return data;
  };

  const { mutate: addMutate } = useMutation({
    mutationFn: postingAnswerMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qnaComments', postId] });
      setToggleAnswer(false);
      setContent('');
      await revalidatePostTag(`qna-detail-${postId}`);
    }
  });

  return (
    <>
      <Default>
        <div>
          <ConfirmModal
            isOpen={isCancleModalOpen}
            onClose={() => {
              setIsCancleModalOpen(false);
            }}
            onConfirm={() => {
              toast.success(QNA_ANSWER_CANCLE_ALRERT_TEXT);
              setToggleAnswer(false);
              setContent('');
            }}
            message={POST_CANCLE_CONFIRM_TEXT}
          />
          <ConfirmModal
            isOpen={isApproveModalOpen}
            onClose={() => {
              setIsApproveModalOpen(false);
            }}
            onConfirm={postingAnswer}
            message={POST_APPROVE_CONFIRM_TEXT}
          />
          <h2 className="h-[27px] text-h5 font-bold mb-4">본문</h2>
          <div className="border rounded-2xl border-neutral-100">
            <CustomMDEditor content={content} setContent={setContent} />
          </div>
        </div>
        <div className="h-[182px] mt-12 flex flex-col gap-4">
          <h5 className="text-h5 font-bold text-neutral-900">태그</h5>
          <SelectTagInput tagList={tagList} setTagList={setTagList} />
        </div>
        <div className="flex gap-6 h-12 w-[240px] ml-auto mt-12 ">
          <Chip intent={'gray'} size="medium" label="취소하기" onClick={handleCancleClick} />
          {content.length === 0 ? (
            <Chip intent={'primary_disabled'} size="medium" label="답변등록" />
          ) : (
            <Chip intent={'primary'} size="medium" label="답변등록" onClick={handleApproveClick} />
          )}
        </div>
      </Default>
      <Mobile>
        <div className="bg-white h-full fixed z-[1000] px-5 py-5 left-0 top-0">
          <ConfirmModal
            isOpen={isCancleModalOpen}
            onClose={() => {
              setIsCancleModalOpen(false);
            }}
            onConfirm={() => {
              toast.success(QNA_ANSWER_CANCLE_ALRERT_TEXT);
              setToggleAnswer(false);
              setContent('');
            }}
            message={POST_CANCLE_CONFIRM_TEXT}
          />
          <ConfirmModal
            isOpen={isApproveModalOpen}
            onClose={() => {
              setIsApproveModalOpen(false);
            }}
            onConfirm={postingAnswer}
            message={POST_APPROVE_CONFIRM_TEXT}
          />
          <div className="flex h-[51px] justify-between items-center ">
            <button onClick={handleCancleClick}>
              <X stroke="#757575" />
            </button>
            <div className="max-h-[35px] ">
              {content.length === 0 ? (
                <Chip intent={'primary_disabled'} size="medium" label="답변등록" />
              ) : (
                <Chip intent={'primary'} size="medium" label="답변등록" onClick={handleApproveClick} />
              )}
            </div>
          </div>
          <div className="text-subtitle2 flex gap-2 max-h-[60px] mb-5 py-2 border-y">
            <span className=" text-main-400 font-regular ">Q.</span>
            <h2 className=" text-neutral-900 font-medium inline max-h-[44px] overflow-hidden">
              {filterSlang(title ?? '')}
            </h2>
          </div>
          <div className="border rounded-2xl border-neutral-100">
            <CustomMDEditor content={content} setContent={setContent} />
          </div>
          <div className="h-[182px] mt-12 flex flex-col gap-2">
            <h5 className="text-subtitle3 font-bold text-neutral-900">태그</h5>
            <SelectTagInput tagList={tagList} setTagList={setTagList} />
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default PostingAnswerArea;
