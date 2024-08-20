'use client';
import { useAuth } from '@/context/auth.context';
import { timeForToday } from '@/utils/timeForToday';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LikeButton from '@/components/common/LikeButton';
import BookmarkButton from '@/components/common/BookmarkButton';
import KebabButton from '@/assets/images/common/KebabButton';
import { revalidate } from '@/actions/revalidate';
import ConfirmModal from '@/components/modal/ConfirmModal';
import ArchiveReplyInput from './ArchiveReplyInput';
import ArchiveReply from './ArchiveReply';
import { archiveCommentsType, commentRetouch } from '@/types/posts/archiveDetailTypes';
import { cutText, filterSlang } from '@/utils/markdownCut';
import { useLoginAlertStore } from '@/store/loginAlertModal';
import LoginAlertModal from '@/components/modal/LoginAlertModal';
import CommentPageButton from '@/components/common/CommentPageButton';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { COMMENT_DELETE_ALRERT_TEXT, COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';

const ArchiveComments = ({ post_user_id }: { post_user_id: string }) => {
  const { me } = useAuth();
  const param = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [mdEditorChange, setMdEditorChange] = useState<string>('');
  const [editingState, setEditingState] = useState<{ [key: string]: boolean }>({});
  const [editingToggleState, setEditingToggleState] = useState<{ [key: string]: boolean }>({});
  const [inputReplyToggle, setInputReplyToggle] = useState<{ [key: string]: boolean }>({});
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>({});
  const [confirmModal, setConfirmModal] = useState<{ [key: string]: boolean }>({});
  const [commentLength, setCommentLength] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;
  const { isOpen, loginAlertModal } = useLoginAlertStore();

  const commentRetouch = useMutation({
    mutationFn: async ({ id, user_id, mdEditorChange }: commentRetouch) => {
      await fetch(`/api/posts/archive-detail/archive-comments/${param.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id, user_id, mdEditorChange })
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['archiveComments'] });
      await queryClient.invalidateQueries({ queryKey: ['myArchiveComments'] });
      revalidate('/', 'layout');
      setEditingState({ Boolean: false });
      toast.success(COMMENT_EDIT_ALERT_TEXT);
    }
  });

  const commentRetouchHandle = async (id: string, user_id: string) => {
    commentRetouch.mutate({ id, user_id, mdEditorChange });
  };

  const commentDelete = useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      const response = await fetch(`/api/posts/archive-detail/archive-comments/${param.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id, user_id })
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['archiveComments'] });
      await queryClient.invalidateQueries({ queryKey: ['myArchiveComments'] });
      revalidate('/', 'page');
      toast.success(COMMENT_DELETE_ALRERT_TEXT);
    }
  });

  const handleDelete = async (id: string, user_id: string) => {
    commentDelete.mutate({ id, user_id });
  };

  const handleCancelEdit = (id: string) => {
    setConfirmModal((prev) => ({ ...prev, [id]: true }));
  };

  const handleConfirmCancelEdit = (id: string) => {
    setEditingState({ [id]: false });
    setConfirmModal((prev) => ({ ...prev, [id]: false }));
  };

  const handleCloseModal = (id: string) => {
    setConfirmModal((prev) => ({ ...prev, [id]: false }));
  };

  const toggleEditing = (id: string, comment: string) => {
    setEditingState({ [id]: !editingState[id] });
    setEditingToggleState({ [id]: false });
    setMdEditorChange(comment);
  };

  const toggleEditingOptions = (id: string) => {
    setEditingToggleState({ [id]: !editingToggleState[id] });
  };

  const changEditor = (value?: string) => {
    setMdEditorChange(value!);
  };

  const { data: comments } = useQuery<archiveCommentsType>({
    queryKey: ['archiveComments', param.id, page],
    queryFn: async () => {
      const response = await fetch(`/api/posts/archive-detail/archive-comments/${param.id}?page=${page - 1}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      return response.json();
    }
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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

  const replyOpenToggle = (id: string) => {
    setReplyToggle({ [id]: !replyToggle[id] });
    setInputReplyToggle({ [id]: false });
  };

  return (
    <>
      <Default>
        <div>
          <div className=" mt-10 mb-6 px-6 text-subtitle1 font-medium ">
            {comments && comments.data.length > 0 && <p>댓글 {comments.count}</p>}
          </div>
          {comments?.data.map((comment) => (
            <div key={comment.id} className="w-full flex flex-col ">
              <div
                className={`flex flex-col justify-around border-b-2 gap-4 p-6 ${
                  comment.user_id === me?.id ? 'bg-sub-50' : 'bg-white'
                }`}
              >
                <div className="flex justify-between ">
                  <div className="flex justify-start items-center gap-4 ">
                    <Image
                      src={comment.user.profile_image}
                      alt="commentUserImage"
                      width={48}
                      height={48}
                      className="rounded-full "
                    />
                    <div className=" flex flex-col gap-1 ">
                      {post_user_id === comment.user_id && (
                        <p className="w-[66px] h-[30px] text-subtitle2 font-medium  px-[12px] py-[4px] text-white bg-main-500 text-center rounded-[4px]  ">
                          글쓴이
                        </p>
                      )}
                      <p className="text-subtitle1 font-medium text-neutral-900">{comment.user.nickname}</p>
                      <p className="text-body2 font-regular text-neutral-300">{timeForToday(comment.updated_at)}</p>
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
                            <div className="w-[105px] right-0 absolute flex flex-col justify-center items-center border-main-400 bg-white shadow-lg border rounded-lg">
                              <button
                                className="h-[44px]  w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                                onClick={() => toggleEditing(comment.id, comment.comment)}
                              >
                                댓글 수정
                              </button>
                              <button
                                className="h-[44px]  w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                                onClick={() => setConfirmModal((prev) => ({ ...prev, [comment.id]: true }))}
                              >
                                댓글 삭제
                              </button>
                              {confirmModal[comment.id] && (
                                <ConfirmModal
                                  isOpen={confirmModal[comment.id]}
                                  onClose={() => setConfirmModal((prev) => ({ ...prev, [comment.id]: false }))}
                                  onConfirm={() => handleDelete(comment.id, comment.user_id)}
                                  message={'댓글을 삭제 할까요?'}
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
                  <div className=" flex flex-col ">
                    <div className="border border-neutral-100 bg-white rounded-xl focus-within:border-main-400">
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
                      <button
                        onClick={() => handleCancelEdit(comment.id)}
                        className="bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-600 text-neutral-100 px-5 py-3 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => commentRetouchHandle(comment.id, comment.user_id)}
                        className="bg-main-100 hover:bg-main-500 text-main-50 px-5 py-3 rounded-lg"
                      >
                        수정
                      </button>
                      {confirmModal[comment.id] && (
                        <ConfirmModal
                          isOpen={confirmModal[comment.id]}
                          onClose={() => handleCloseModal(comment.id)}
                          onConfirm={() => handleConfirmCancelEdit(comment.id)}
                          message={'댓글 작성을 중단 할까요?'}
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
                    <p className="text-body1 font-regular whitespace-pre-wrap break-words">
                      {cutText(filterSlang(comment.comment), 370)}
                    </p>
                    {comment.comment.length >= 370 && (
                      <button
                        className="text-subtitle2 font-bold text-neutral-700"
                        onClick={() => setCommentLength(true)}
                      >
                        ...더보기
                      </button>
                    )}
                  </div>
                )}
                <div className=" flex justify-between gap-4">
                  <p className="text-body1 font-regular text-neutral-400">
                    {comment.created_at.slice(0, 10).replace(/-/g, '.')}
                  </p>
                  <div className=" flex gap-4">
                    <LikeButton id={comment.id} type="forumComment" />
                    <BookmarkButton id={comment.id} type="forumComment" />
                    {replyToggle[comment.id] ? (
                      <div className="flex gap-5">
                        <button
                          onClick={() => replyOpenToggle(comment.id)}
                          className="text-subtitle1 font-medium text-main-400"
                        >
                          댓글 모두 숨기기
                        </button>
                        <button
                          className="text-subtitle1 font-medium text-neutral-400"
                          onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                        >
                          {inputReplyToggle[comment.id] ? '댓글 취소' : '댓글 쓰기'}
                        </button>
                      </div>
                    ) : comment.reply[0].count !== 0 ? (
                      <button
                        onClick={() => replyOpenToggle(comment.id)}
                        className="text-subtitle1 font-medium text-main-400"
                      >
                        {comment.reply[0].count}개의 댓글 보기
                      </button>
                    ) : (
                      <button
                        className="text-subtitle1 font-medium text-neutral-400"
                        onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                      >
                        댓글 쓰기
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {inputReplyToggle[comment.id] ? (
                <ArchiveReplyInput
                  comment_id={comment.id}
                  toggle={handleInputReplyToggle}
                  count={comment.reply[0].count}
                />
              ) : null}
              {replyToggle[comment.id] ? <ArchiveReply comment_id={comment.id} post_user_id={post_user_id} /> : null}
            </div>
          ))}
          <div className="mt-6 mb-20">
            <CommentPageButton
              totalItems={comments?.count || 0}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
          {loginAlertModal && <LoginAlertModal />}
        </div>
      </Default>
      <Mobile>
        <div className="mt-5 mb-6 px-5 subtitle3-bold-14px ">
          {comments && comments.data.length > 0 && <p>댓글 {comments.count}</p>}
        </div>
        {comments?.data.map((comment) => (
          <div key={comment.id} className={`w-full flex flex-col  `}>
            <div
              className={`flex flex-col justify-around border-b-2 gap-2 md:gap-4 p-5 md:px-5 md:py-6 ${replyToggle[comment.id] ? 'mx-5' : 'mx-0'} md:mx-0 ${comment.user_id === me?.id ? 'bg-sub-50' : 'bg-white'}`}
            >
              <div className="flex justify-between ">
                <div className="flex justify-start items-center gap-3 ">
                  <Image
                    src={comment.user.profile_image}
                    alt="commentUserImage"
                    width={36}
                    height={36}
                    className="rounded-full "
                  />
                  <div className=" flex flex-col">
                    {post_user_id === comment.user_id && (
                      <p className="w-[34px] h-[19px] text-white text-subtitle4 font-semibold  bg-main-400 text-center rounded-[4px] ">
                        글쓴이
                      </p>
                    )}
                    <p className="body4-medium-13px text-neutral-900">{comment.user.nickname}</p>
                    <p className="body4-regular-13px text-neutral-300">{timeForToday(comment.updated_at)}</p>
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
                          <div className="w-[82px] right-0 absolute flex flex-col justify-center items-center border-main-400 bg-white text-body4 font-regular shadow-lg border rounded-lg">
                            <button
                              className="h-9  w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                              onClick={() => toggleEditing(comment.id, comment.comment)}
                            >
                              댓글 수정
                            </button>
                            <button
                              className="h-9  w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                              onClick={() => setConfirmModal((prev) => ({ ...prev, [comment.id]: true }))}
                            >
                              댓글 삭제
                            </button>
                            {confirmModal[comment.id] && (
                              <ConfirmModal
                                isOpen={confirmModal[comment.id]}
                                onClose={() => setConfirmModal((prev) => ({ ...prev, [comment.id]: false }))}
                                onConfirm={() => handleDelete(comment.id, comment.user_id)}
                                message={'댓글을 삭제 할까요?'}
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
                <div className=" flex flex-col ">
                  <div className="border border-neutral-100 bg-white rounded-xl  focus-within:border-main-400">
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
                    <button
                      onClick={() => handleCancelEdit(comment.id)}
                      className="bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-600 text-neutral-100 px-5 py-3 rounded-lg"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => commentRetouchHandle(comment.id, comment.user_id)}
                      className="bg-main-100 hover:bg-main-500 text-main-50 px-5 py-3 rounded-lg"
                    >
                      수정
                    </button>
                    {confirmModal[comment.id] && (
                      <ConfirmModal
                        isOpen={confirmModal[comment.id]}
                        onClose={() => handleCloseModal(comment.id)}
                        onConfirm={() => handleConfirmCancelEdit(comment.id)}
                        message={'댓글 작성을 중단 할까요?'}
                      />
                    )}
                  </div>
                </div>
              ) : commentLength ? (
                <p className="text-neutral-900 body3-regular-14px whitespace-pre-wrap break-words mb-2">
                  {filterSlang(comment.comment)}
                </p>
              ) : (
                <div>
                  <p className="text-neutral-900 body3-regular-14px whitespace-pre-wrap break-words mb-2">
                    {cutText(filterSlang(comment.comment), 370)}
                  </p>
                  {comment.comment.length >= 370 && (
                    <button className="subtitle3-bold-14px text-neutral-700" onClick={() => setCommentLength(true)}>
                      ...더보기
                    </button>
                  )}
                </div>
              )}
              <div className="flex justify-start items-start gap-2 mb-2">
                <p className="body3-regular-14px text-neutral-400">
                  {comment.created_at.slice(0, 10).replace(/-/g, '.')}
                </p>
              </div>
              <div className=" flex justify-between">
                <div className=" flex justify-between gap-[12px]">
                  <LikeButton id={comment.id} type="forumComment" />
                  <BookmarkButton id={comment.id} type="forumComment" />
                </div>
                {replyToggle[comment.id] ? (
                  <div className="w-[252px] h-[21px] flex justify-end gap-[12px] ">
                    <button onClick={() => replyOpenToggle(comment.id)} className=" body3-medium-14px text-main-400">
                      댓글 모두 숨기기
                    </button>
                    <button
                      className="body3-medium-14px text-neutral-400"
                      onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                    >
                      {inputReplyToggle[comment.id] ? '댓글 취소' : '댓글 쓰기'}
                    </button>
                  </div>
                ) : comment.reply[0].count !== 0 ? (
                  <button onClick={() => replyOpenToggle(comment.id)} className="body3-medium-14px text-main-400">
                    {comment.reply[0].count}개의 댓글 보기
                  </button>
                ) : (
                  <button
                    className="body3-medium-14px text-neutral-400"
                    onClick={() => handleInputReplyToggle(comment.id, comment.reply[0].count)}
                  >
                    댓글 쓰기
                  </button>
                )}
              </div>
            </div>
            {inputReplyToggle[comment.id] ? (
              <ArchiveReplyInput
                comment_id={comment.id}
                toggle={handleInputReplyToggle}
                count={comment.reply[0].count}
              />
            ) : null}
            {replyToggle[comment.id] ? <ArchiveReply comment_id={comment.id} post_user_id={post_user_id} /> : null}
          </div>
        ))}
        <div className="mt-6 mb-20">
          <CommentPageButton
            totalItems={comments?.count || 0}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
        {loginAlertModal && <LoginAlertModal />}
      </Mobile>
    </>
  );
};

export default ArchiveComments;
