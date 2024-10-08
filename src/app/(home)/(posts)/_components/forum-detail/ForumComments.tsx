'use client';

import { useAuth } from '@/context/auth.context';
import { timeForToday } from '@/utils/timeForToday';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ForumReply from './ForumReply';
import ForumReplyInput from './ForumReplyInput';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { commentRetouch, forumCommentsType } from '@/types/posts/forumDetailTypes';
import LikeButton from '@/components/common/LikeButton';
import BookmarkButton from '@/components/common/BookmarkButton';
import KebabButton from '@/assets/images/common/KebabButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { cutText, filterSlang } from '@/utils/markdownCut';
import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { useLoginAlertStore } from '@/store/loginAlertModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import { COMMENT_DELETE_ALRERT_TEXT, COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';
import Chip from '@/components/common/Chip';
import { COMMENT_CANCLE_CONFIRM_TEXT, COMMENT_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import CommentPageButton from '@/components/common/CommentPageButton';
import ForumDetailSkeleton from './skeleton/ForumDetailSkeleton';

const ForumComments = ({ post_user_id }: { post_user_id: string }) => {
  const { me } = useAuth();
  const param = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [commentsPage, setCommentsPage] = useState<number>(1);
  const [mdEditorChange, setMdEditorChange] = useState<string>('');
  const [editingState, setEditingState] = useState<{ [key: string]: boolean }>({});
  const [editingToggleState, setEditingToggleState] = useState<{ [key: string]: boolean }>({});
  const [inputReplyToggle, setInputReplyToggle] = useState<{ [key: string]: boolean }>({});
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>({});
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false);
  const [commentLength, setCommentLength] = useState<boolean>(false);
  const [cancelCommentModal, setCancelCommentModal] = useState<boolean>(false);
  const { isOpen, loginAlertModal } = useLoginAlertStore();

  //댓글 수정
  const commentRetouch = useMutation({
    mutationFn: async ({ id, user_id, mdEditorChange }: commentRetouch) => {
      await fetch(`/api/posts/forum-detail/forum-comments/${param.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id, user_id, mdEditorChange })
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['forumComments'] });
      await queryClient.invalidateQueries({ queryKey: ['myComments'] });
      setEditingState({ Boolean: false });
      toast.success(COMMENT_EDIT_ALERT_TEXT);
    }
  });

  // 수정 이벤트 버튼
  const commentRetouchHandle = async (id: string, user_id: string) => {
    commentRetouch.mutate({ id, user_id, mdEditorChange });
  };

  // 댓글 삭제
  const commentDelete = useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      await fetch(`/api/posts/forum-detail/forum-comments/${param.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id, user_id })
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['forumComments'] });
      await queryClient.invalidateQueries({ queryKey: ['myComments'] });
      await revalidatePostTag(`forum-detail-${param.id}`);
      toast.success(COMMENT_DELETE_ALRERT_TEXT);
    }
  });

  // 삭제 이벤트 버튼
  const handleDelete = async (id: string, user_id: string) => {
    commentDelete.mutate({ id, user_id });
  };

  //수정 취소버튼
  const toggleEditing = (id: string, comment: string) => {
    setEditingState({ [id]: !editingState[id] });
    setEditingToggleState({ [id]: false });
    setMdEditorChange(comment);
  };
  //댓글 Kebob
  const toggleEditingOptions = (id: string) => {
    setEditingToggleState({ [id]: !editingToggleState[id] });
  };

  const changEditor = (value?: string) => {
    setMdEditorChange(value!);
  };

  //댓글 가져오기
  const { data: comments, isPending } = useQuery({
    queryKey: ['forumComments', param.id, commentsPage],
    queryFn: async () => {
      const response = await fetch(`/api/posts/forum-detail/forum-comments/${param.id}?page=${commentsPage}`);
      const data = await response.json();
      return data as Promise<forumCommentsType>;
    },
    gcTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    retry: 1
  });

  if (isPending) {
    return <ForumDetailSkeleton />;
  }

  // console.log(comments?.count);
  const COMMENT_PAGE = 5;
  const commentsCount = comments?.count ?? 0;

  const handleCommentPage = (newPage: number) => {
    setCommentsPage(newPage);
  };

  //reply 입력창 toggle
  const handleInputReplyToggle = (id: string, count: number) => {
    if (!me) {
      isOpen();
      return;
    }
    setInputReplyToggle({ [id]: !inputReplyToggle[id] });
    if (count === 0) {
      setReplyToggle({ [id]: !replyToggle[id] });
    }
  };
  //reply 보기 toggle
  const replyOpenToggle = (id: string) => {
    setReplyToggle({ [id]: !replyToggle[id] });
    setInputReplyToggle({ [id]: false });
  };

  return (
    <>
      <div className=" md:mt-10 mt-5 px-5 pb-2 md:mb-6 md:px-6 text-subtitle3 md:text-subtitle1 font-medium ">
        <p>댓글 {comments?.count}</p>
      </div>
      {comments?.data?.map((comment) => (
        <div key={comment.id}>
          <div key={comment.id} className={`w-full flex flex-col  `}>
            <div
              className={`flex flex-col justify-around border-b-2 gap-2 md:gap-4 p-5 md:px-5 md:py-6 ${replyToggle[comment.id] ? 'mx-5' : 'mx-0'} md:mx-0 ${comment.user_id === me?.id ? 'bg-sub-50' : 'bg-white'}`}
            >
              <div className="flex justify-between ">
                <div className="flex justify-start items-center gap-3 md:gap-4">
                  <Image
                    src={comment.user.profile_image}
                    alt="commentUserImage"
                    width={48}
                    height={48}
                    className="rounded-full w-9 h-9 md:w-10 md:h-10"
                  />
                  <div className=" flex flex-col md:gap-1 ">
                    {post_user_id === comment.user_id && (
                      <p className=" text-subtitle4 font-semibold md:text-subtitle2 md:font-medium p-1 md:w-[66px] w-[34px] md:px-[12px] md:py-[4px] text-white bg-main-400 text-center rounded-[4px]  ">
                        글쓴이
                      </p>
                    )}
                    <p className="text-body4 md:text-subtitle1 font-medium text-neutral-900">{comment.user.nickname}</p>
                    <p className="text-body4 md:text-body2 font-regular text-neutral-300">
                      {timeForToday(comment.updated_at)}
                    </p>
                  </div>
                </div>
                <div className=" relative">
                  <div className=" right-0">
                    {me?.id === comment.user_id && (
                      <>
                        {editingState[comment.id] ? null : (
                          <div onClick={() => toggleEditingOptions(comment.id)} className=" p-2 ">
                            <KebabButton />
                          </div>
                        )}
                        {editingToggleState[comment.id] && (
                          <div className="w-[82px] md:w-[105px] right-0 absolute flex flex-col justify-center text-body4 md:text-body2 font-regular items-center border-main-400 bg-white shadow-lg border rounded-lg z-50">
                            <button
                              className="h-9 md:h-11  w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                              onClick={() => toggleEditing(comment.id, comment.comment)}
                            >
                              댓글 수정
                            </button>
                            <button
                              className="h-9 md:h-11  w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                              onClick={() => setDeleteConfirmModal(true)}
                            >
                              댓글 삭제
                            </button>
                            {deleteConfirmModal && (
                              <ConfirmModal
                                isOpen={deleteConfirmModal}
                                onClose={() => setDeleteConfirmModal(false)}
                                onConfirm={() => handleDelete(comment.id, comment.user_id)}
                                message={COMMENT_DELETE_CONFIRM_TEXT}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {editingState[comment.id] ? (
                <div className=" flex flex-col  ">
                  <div className="border border-neutral-100  rounded-[12px] bg-white ">
                    <MDEditor
                      value={mdEditorChange}
                      onChange={changEditor}
                      preview="edit"
                      extraCommands={commands.getCommands().filter(() => false)}
                      commands={commands.getCommands().filter((command) => {
                        return command.name !== 'image';
                      })}
                      textareaProps={{ maxLength: 1000 }}
                      height={'auto'}
                    />
                  </div>
                  <div className="flex justify-end items-end mt-4 gap-6">
                    <Chip
                      intent="gray"
                      size="medium"
                      label="취소"
                      onClick={() => toggleEditing(comment.id, comment.user_id)}
                    />
                    {mdEditorChange === comment.comment ? (
                      <Chip intent="primary_disabled" size="medium" label="수정" />
                    ) : (
                      <Chip
                        intent="primary"
                        size="medium"
                        label="수정"
                        onClick={() => commentRetouchHandle(comment.id, comment.user_id)}
                      />
                    )}
                  </div>
                </div>
              ) : commentLength ? (
                <p className="text-body1 font-regular whitespace-pre-wrap break-words">
                  {filterSlang(comment.comment)}
                </p>
              ) : (
                <div>
                  <div className="text-body3 md:text-body1 w-full font-regular whitespace-pre-wrap break-words text-neutral-900">
                    <MDEditor.Markdown source={cutText(filterSlang(comment.comment), 370)} />
                  </div>
                  {comment.comment.length >= 370 && (
                    <button
                      className="text-subtitle3 md:text-subtitle2 font-bold text-neutral-700"
                      onClick={() => setCommentLength(true)}
                    >
                      ...더보기
                    </button>
                  )}
                </div>
              )}
              <div className=" md:flex md:justify-between md:gap-4">
                <p className="text-body3 md:text-body1 font-regular text-neutral-400">
                  {comment.created_at.slice(0, 10).replace(/-/g, '.')}
                </p>
                <div className=" flex justify-between md:justify-end  md:gap-4">
                  <div className=" flex gap-3 md:gap-4 mt-2 md:mt-0">
                    <LikeButton id={comment.id} type="forumComment" />
                    <BookmarkButton id={comment.id} type="forumComment" />
                  </div>
                  {replyToggle[comment.id] ? (
                    <div className="flex gap-5">
                      <button
                        onClick={() => replyOpenToggle(comment.id)}
                        className="text-body3 md:text-subtitle1 font-medium text-main-400"
                      >
                        댓글 모두 숨기기
                      </button>
                      <button
                        className="text-body3 md:text-subtitle1 font-medium text-neutral-400"
                        onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                      >
                        {inputReplyToggle[comment.id] ? '댓글 취소' : '댓글 쓰기'}
                      </button>
                    </div>
                  ) : comment.reply[0].count !== 0 ? (
                    <button
                      onClick={() => replyOpenToggle(comment.id)}
                      className="text-body3 md:text-subtitle1 font-medium text-main-400"
                    >
                      {comment.reply[0].count}개의 댓글 보기
                    </button>
                  ) : (
                    <button
                      className="text-body3 md:text-subtitle1 font-medium text-neutral-400"
                      onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                    >
                      댓글 쓰기
                    </button>
                  )}
                </div>
              </div>
            </div>

            {inputReplyToggle[comment.id] ? (
              <ForumReplyInput
                comment_id={comment.id}
                toggle={handleInputReplyToggle}
                count={comment.reply[0].count}
                commentsPage={commentsPage}
              />
            ) : null}
            {replyToggle[comment.id] ? (
              <ForumReply comment_id={comment.id} post_user_id={post_user_id} commentsPage={commentsPage} />
            ) : null}
          </div>
        </div>
      ))}
      <CommentPageButton
        totalItems={commentsCount}
        itemsPerPage={COMMENT_PAGE}
        currentPage={commentsPage}
        onPageChange={handleCommentPage}
      />
      {loginAlertModal && <LoginAlertModal />}
    </>
  );
};

export default ForumComments;
