import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TqnaCommentsWithReplyCount } from '@/types/posts/qnaDetailTypes';
import LikeButton from '@/components/common/LikeButton';
import { useAuth } from '@/context/auth.context';
import { timeForToday } from '@/utils/timeForToday';
import BookmarkButton from '@/components/common/BookmarkButton';
import CustomMDEditor from '@/components/common/CustomMDEditor';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import BlueCheck from '@/assets/images/common/BlueCheck';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revalidatePostTag } from '@/actions/revalidatePostTag';
import TagBlock from '@/components/common/TagBlock';
import SelectTagInput from '@/components/common/SelectTagInput';
import { TAG_LIST } from '@/constants/tags';
import ConfirmModal from '@/components/modal/ConfirmModal';
import SelectAnswer from '@/assets/images/qna/SelectAnswer';
import Chip from '@/components/common/Chip';
import Tag from '@/components/common/Tag';
import { filterSlang } from '@/utils/markdownCut';
import {
  QNA_ANSWER_EDIT_ALERT_TEXT,
  QNA_ANSWER_EDIT_CANCLE_ALRERT_TEXT,
  SELECT_ANSWER_ALERT_TEXT
} from '@/constants/alert';
import {
  POST_APPROVE_CONFIRM_TEXT,
  POST_EDIT_CANCLE_CONFIRM_TEXT,
  SELECT_ANSWER_CONFIRM_TEXT
} from '@/constants/confirmModal';
import KebobBtn from '../kebob-btn/KebobBtn';
import Replies from '../qna-comments/Replies';
import Dot from '@/assets/images/common/Dot';
import CommentBubble from '@/assets/images/common/CommentBubble';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import X from '@/assets/images/common/X';

type QnaAnswerProps = {
  sortedByLikes?: boolean;
  setSortedByLikes?: Dispatch<SetStateAction<boolean>>;
  qnaComment: TqnaCommentsWithReplyCount;
  questioner: string;
  index?: number;
  qnaCommentsCount?: number;
  title: string;
};

const QnaAnswer = ({
  sortedByLikes,
  setSortedByLikes,
  qnaComment,
  questioner,
  index,
  qnaCommentsCount,
  title
}: QnaAnswerProps) => {
  const { me } = useAuth();
  const { postId, selectedComment, setSelectedComment } = useQnaDetailStore();
  const [openAnswerReply, setOpenAnswerReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(qnaComment.comment);
  const [tagList, setTagList] = useState<Array<Ttag>>(TAG_LIST);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCancleModalOpen, setIsCancleModalOpen] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handelLikeSortTrue = () => {
    index === 0 && setSortedByLikes ? setSortedByLikes(true) : null;
  };
  const handelLikeSortFalse = () => {
    index === 0 && setSortedByLikes ? setSortedByLikes(false) : null;
  };

  const handleReplyClick = () => {
    setOpenAnswerReply((prev) => !prev);
  };

  const handleEditClick = () => {
    if (content.length === 0) return;
    setIsEditModalOpen(true);
  };

  const handleCancleClick = () => {
    setIsCancleModalOpen(true);
  };

  const handelSelectClick = () => {
    setIsSelectModalOpen(true);
  };

  const selectComment = async (): Promise<void> => {
    setSelectedComment(qnaComment.id);
    selectMutate();
    await revalidatePostTag(`qna-detail-${postId}`);
  };

  const selectCommentMutation = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/question/${postId}?comment_id=${qnaComment.id}`,
      {
        method: 'PATCH'
      }
    );
    const { data, message } = await response.json();
    if (message) {
      toast.error(message);
    }
    return data;
  };

  const { mutate: selectMutate } = useMutation({
    mutationFn: selectCommentMutation,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['qnaComments', postId] });
      toast.success(SELECT_ANSWER_ALERT_TEXT);
    }
  });

  const editComment = async (): Promise<void> => {
    if (content.length === 0) {
      toast.error('내용을 입력해주세요!');
      return;
    }
    editMutate({
      commentId: qnaComment.id,
      comment: content,
      tags: tagList.filter((tag) => tag.selected),
      user_id: me?.id ?? ''
    });
    toast.success(QNA_ANSWER_EDIT_ALERT_TEXT);
    setIsEdit(false);
    await revalidatePostTag(`qna-detail-${postId}`);
  };

  const editCommentMutation = async ({
    commentId,
    comment,
    tags,
    user_id
  }: {
    commentId: string;
    comment: string;
    tags: Ttag[];
    user_id: string;
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/comment/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ comment, tags, user_id })
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    return data;
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: editCommentMutation,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['qnaComments', postId] });
    }
  });

  useEffect(() => {
    const commentTagList = qnaComment.qna_comment_tag.map((tag) => tag.tag);
    setTagList(
      TAG_LIST.map((TAG) => {
        return commentTagList.includes(TAG.name) ? { ...TAG, selected: !TAG.selected } : TAG;
      })
    );
  }, [qnaComment.qna_comment_tag]);
  return (
    <div
      className={`bg-white md:max-w-[1204px] md:py-12 py-5 md:mb-8 mb-4 px-5 md:px-6 md:border ${selectedComment === qnaComment.id ? 'md:border-main-400' : ''} md:rounded-2xl overflow-auto`}
    >
      <div className="mb-6">
        {index === 0 ? (
          <div className="flex mb-5 md:mb-6 border-b border-neutral-100 pb-5 md:pb-12 md:max-w-[1156px]">
            <div className=" text-subtitle3 md:text-h4 font-bold ">{qnaCommentsCount}개의 답변</div>
            <div className="flex gap-3 body-4 text-body4 md:text-subtitle2 font-medium ml-auto">
              <button
                className={`underline hover:font-bold ${sortedByLikes ? '' : 'font-bold'}`}
                onClick={handelLikeSortFalse}
              >
                {selectedComment ? '채택순' : '답변순'}
              </button>
              <div className="flex items-center">
                <Dot />
              </div>
              <button
                className={`underline hover:font-bold ${sortedByLikes ? 'font-bold' : ''}`}
                onClick={handelLikeSortTrue}
              >
                좋아요순
              </button>
            </div>
          </div>
        ) : null}
        <div
          className={`flex gap-4 items-center ${selectedComment === qnaComment.id ? 'bg-main-50 border border-main-400 md:border-none' : 'bg-neutral-50'}  px-3 py-4 md:py-6 md:px-5 rounded-xl md:rounded-2xl`}
        >
          <div>
            {qnaComment.users.profile_image ? (
              <div className="relative md:w-12 md:h-12 w-9 h-9">
                <Image
                  src={qnaComment.users?.profile_image ?? ''}
                  alt="Profile"
                  fill
                  className="rounded-full"
                  sizes="48px,48px"
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>

          <div className={`flex flex-col `}>
            <div className="flex">
              {selectedComment === qnaComment.id ? (
                <div className="flex gap-2 items-center">
                  <BlueCheck />
                  <Tag intent="primary" label="채택된 답변" />
                  {qnaComment.user_id === me?.id ? <Tag intent="primary" label="내가 쓴 글" /> : null}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  {qnaComment.user_id === me?.id ? <Tag intent="primary" label="내가 쓴 글" /> : null}
                </div>
              )}
            </div>
            <div className="flex gap-1 md:gap-2 md:py-2 items-center">
              <span className="text-body3 md:text-subtitle1 text-neutral-900">{qnaComment.users.nickname}</span>
              <span>
                <Dot />
              </span>
              <span className="whitespace-nowrap text-body3 md:text-body1 text-neutral-500">
                {timeForToday(qnaComment.updated_at ?? '')}
              </span>
            </div>
          </div>
          <div className="ml-auto">
            {me?.id === qnaComment.user_id ? (
              <KebobBtn commentId={qnaComment.id} setIsEdit={setIsEdit} category="answer" />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <div className=" max-w-[1204px]">
        {isEdit ? (
          <>
            <Default>
              <div className="flex flex-col">
                <ConfirmModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                  }}
                  onConfirm={editComment}
                  message={POST_APPROVE_CONFIRM_TEXT}
                />

                <ConfirmModal
                  isOpen={isCancleModalOpen}
                  onClose={() => {
                    setIsCancleModalOpen(false);
                  }}
                  onConfirm={() => {
                    toast.success(QNA_ANSWER_EDIT_CANCLE_ALRERT_TEXT);
                    setIsEdit(false);
                    setContent(qnaComment.comment);
                  }}
                  message={POST_EDIT_CANCLE_CONFIRM_TEXT}
                />
                <div className="border border-neutral-100 bg-white rounded-xl">
                  <CustomMDEditor content={content} setContent={setContent} />
                </div>
                <div className="h-[182px] mt-12 flex flex-col gap-2 md:gap-4">
                  <h5 className="text-subtitle3 md:text-h5 font-bold text-neutral-900">태그</h5>
                  <SelectTagInput tagList={tagList} setTagList={setTagList} />
                </div>
                <div className="flex gap-4 ml-auto">
                  <Chip intent={'gray'} size={'medium'} label="취소하기" onClick={handleCancleClick} />
                  <Chip
                    intent={`${content.length === 0 ? 'secondary_disabled' : 'secondary'}`}
                    size={'medium'}
                    label="수정하기"
                    onClick={handleEditClick}
                  />
                </div>
              </div>
            </Default>
            <Mobile>
              <div className="bg-white w-full h-full fixed z-[1000] px-5 py-5 left-0 top-0 overflow-auto">
                <ConfirmModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                  }}
                  onConfirm={editComment}
                  message={POST_APPROVE_CONFIRM_TEXT}
                />

                <ConfirmModal
                  isOpen={isCancleModalOpen}
                  onClose={() => {
                    setIsCancleModalOpen(false);
                  }}
                  onConfirm={() => {
                    toast.success(QNA_ANSWER_EDIT_CANCLE_ALRERT_TEXT);
                    setIsEdit(false);
                    setContent(qnaComment.comment);
                  }}
                  message={POST_EDIT_CANCLE_CONFIRM_TEXT}
                />
                <div className="flex h-[51px] justify-between items-center ">
                  <button onClick={handleCancleClick}>
                    <X stroke="#757575" />
                  </button>
                  <div className="max-h-[35px] ">
                    {content.length === 0 ? (
                      <Chip intent={'primary_disabled'} size="medium" label="수정하기" />
                    ) : (
                      <Chip intent={'primary'} size="medium" label="수정하기" onClick={handleEditClick} />
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
                <div className="min-w-full whitespace-nowrap h-[182px] mt-12 flex flex-col gap-2">
                  <h5 className="text-subtitle3 font-bold text-neutral-900">태그</h5>
                  <SelectTagInput tagList={tagList} setTagList={setTagList} />
                </div>
              </div>
            </Mobile>
          </>
        ) : (
          <MDEditor.Markdown
            style={{
              maxWidth: '1000px',
              maxHeight: '1000px',
              overflow: 'auto',
              fontSize: '18px',
              lineHeight: '150%',
              letterSpacing: '-1'
            }}
            source={filterSlang(qnaComment.comment)}
          />
        )}
        <div className={`flex flex-wrap gap-[6px] my-6 ${isEdit ? 'hidden' : ''}`}>
          {qnaComment.qna_comment_tag.map((tag) => (
            <TagBlock key={'answer' + tag.tag} tag={tag.tag} />
          ))}
        </div>
      </div>
      <div className="flex justify-between  h-[59px] items-center">
        <div className={`w-full flex flex-col md:flex-row gap-6 md:items-center `}>
          <span className="text-body3 md:text-body1 text-neutral-400 md:min-w-24">
            {qnaComment.created_at?.slice(0, 10).split('-').join('. ')}
          </span>
          <div className={`w-full flex gap-2 md:gap-4 h-10 md:h-12 items-center`}>
            <div className="flex gap-1 ">
              <LikeButton id={qnaComment.id} type={'qnaComment'} />
            </div>
            <div className="flex gap-1 ">
              <BookmarkButton id={qnaComment.id} type={'qnaComment'} />
            </div>
            <button
              className={`flex gap-1 md:text-subtitle1 font-medium text-body3 ${me?.id === questioner && !selectedComment ? 'mr-auto ml-0' : 'ml-auto'}`}
              onClick={handleReplyClick}
            >
              {qnaComment?.qna_reply[0].count !== 0 && openAnswerReply ? (
                <div className="text-main-400">댓글 모두 숨기기</div>
              ) : qnaComment?.qna_reply[0].count !== 0 ? (
                <div className="flex gap-[2px] md:gap-1 text-neutral-400">
                  <CommentBubble /> {qnaComment?.qna_reply[0].count}
                </div>
              ) : openAnswerReply ? (
                <div className="text-main-400">댓글 쓰기</div>
              ) : (
                <div className="text-neutral-400 ">댓글 쓰기</div>
              )}
            </button>
            {me?.id === questioner && !selectedComment ? (
              <button onClick={handelSelectClick}>
                <SelectAnswer />
              </button>
            ) : null}
          </div>
        </div>
        <ConfirmModal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
          }}
          onConfirm={selectComment}
          message={SELECT_ANSWER_CONFIRM_TEXT}
        />
      </div>
      {openAnswerReply ? <Replies commentId={qnaComment.id} replyCount={qnaComment?.qna_reply[0].count} /> : null}
    </div>
  );
};

export default QnaAnswer;
