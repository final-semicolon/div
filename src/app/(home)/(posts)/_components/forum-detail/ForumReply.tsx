'use client';

import KebabButton from '@/assets/images/common/KebabButton';
import { useAuth } from '@/context/auth.context';
import { forumCommentsType, forumReplyType, replyRetouch } from '@/types/posts/forumDetailTypes';
import { timeForToday } from '@/utils/timeForToday';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { cutText, filterSlang } from '@/utils/markdownCut';
import { COMMENT_DELETE_ALRERT_TEXT, COMMENT_EDIT_ALERT_TEXT } from '@/constants/alert';
import Chip from '@/components/common/Chip';
import { COMMENT_DELETE_CONFIRM_TEXT } from '@/constants/confirmModal';
import ReplyPageBtn from '@/components/common/ReplyPageBtn';
import ForumDetailSkeleton from './skeleton/ForumDetailSkeleton';

const ForumReply = ({
  comment_id,
  post_user_id,
  commentsPage
}: {
  comment_id: string;
  post_user_id: string;
  commentsPage: number;
}) => {
  const { me } = useAuth();
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const [replyRetouch, setReplyRetouch] = useState<string>('');
  const [replyEditor, setReplyEditor] = useState<{ [key: string]: boolean }>({});
  const [replyEditorToggle, setReplyEditorToggle] = useState<{ [key: string]: boolean }>({});
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [replyLength, setReplyLength] = useState<boolean>(false);
  const [replyCancelModal, setReplyCancelModal] = useState<boolean>(false);

  //대댓글 수정
  const replyRetouchMutation = useMutation({
    mutationFn: async ({ id, user_id, replyRetouch }: replyRetouch) => {
      const response = await fetch(`/api/posts/forum-detail/forum-reply/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id, user_id, replyRetouch })
      });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentReply', comment_id] });
      toast.success(COMMENT_EDIT_ALERT_TEXT);
    }
  });

  const replyRetouchHandle = async (id: string, user_id: string) => {
    replyRetouchMutation.mutate({ id, user_id, replyRetouch });
    setReplyEditor({ [id]: false });
  };

  //대댓글 삭제
  const commentDelete = useMutation({
    mutationFn: async ({ id, user_id, comment_id }: { id: string; user_id: string; comment_id: string }) => {
      const response = await fetch(`/api/posts/forum-detail/forum-reply/${params.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id, user_id, comment_id })
      });
      const data = response.json();
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['commentReply'] });
      if (comment_id) {
        await queryClient.setQueryData(['forumComments', params.id, commentsPage], (oldData: forumCommentsType) => {
          const newComment = oldData.data.map((comment) =>
            comment.id === comment_id ? { ...comment, reply: [{ count: data?.replyCount }] } : comment
          );
          return { ...oldData, data: newComment };
        });
      }
      toast.success(COMMENT_DELETE_ALRERT_TEXT);
    }
  });

  const handleReplyDelete = (id: string, user_id: string, comment_id: string) => {
    commentDelete.mutate({ id, user_id, comment_id });
  };

  //대댓글 가져오기
  const { data: reply, isPending } = useQuery({
    queryKey: ['commentReply', comment_id, page],
    queryFn: async () => {
      const response = await fetch(`/api/posts/forum-detail/forum-reply/${comment_id}?page=${page}`);
      const data = await response.json();
      return data as Promise<forumReplyType>;
    },
    gcTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    retry: 1
  });

  if (isPending) {
    return <ForumDetailSkeleton />;
  }
  //reply 페이지 수
  const COMMENT_REPLY_PAGE = 5;
  const replyCount = reply?.count;
  const totalPage = Math.ceil((replyCount as number) / COMMENT_REPLY_PAGE);

  //MDeditor
  const changReplyRetouch = (value?: string) => {
    setReplyRetouch(value!);
  };

  //댓글 수정 열기
  const toggleReplyEditing = (id: string, reply: string) => {
    setReplyEditor({ [id]: true });
    setReplyEditorToggle({ [id]: !replyEditorToggle[id] });
    setReplyRetouch(reply);
  };
  //댓글 수정&삭제 케밥
  const toggleEditingOptions = (id: string) => {
    setReplyEditorToggle({ [id]: !replyEditorToggle[id] });
  };

  return (
    <div className="flex flex-col justify-end items-end mx-5 md:mx-0 ">
      {reply?.reply.map((reply) => (
        <div key={reply.id} className="w-full">
          {reply.comment_id === comment_id && (
            <div
              key={reply.id}
              className={`flex flex-col justify-between  border-l-4 border-[#C7DCF5] border-b-[1px] gap-2 px-6 ${post_user_id === reply.user_id ? 'pt-[10px] pb-5' : 'py-5'} md:gap-4 md:p-6 ${reply.user_id === me?.id ? 'bg-sub-50' : 'bg-white'}`}
            >
              <div className="flex justify-between ">
                <div className=" flex justify-start items-center gap-4">
                  <Image
                    src={reply.user.profile_image}
                    alt="replyUserImage"
                    width={48}
                    height={48}
                    className="rounded-full w-9 h-9 md:w-10 md:h-10 "
                  />
                  <div className=" flex flex-col">
                    {post_user_id === reply.user_id && (
                      <p className="  text-subtitle4 font-semibold md:text-subtitle2 md:font-medium p-1  md:px-[12px] md:py-[4px] text-white bg-main-500 text-center rounded-[4px]  ">
                        글쓴이
                      </p>
                    )}
                    <p className="text-body4 md:text-subtitle1 font-medium text-neutral-900">{reply.user.nickname}</p>
                    <p className="text-body4 md:text-body2 font-regular text-neutral-300">
                      {timeForToday(reply.updated_at)}
                    </p>
                  </div>
                </div>
                <div className=" relative  ">
                  {me?.id === reply.user_id && (
                    <>
                      {replyEditor[reply.id] ? null : (
                        <div onClick={() => toggleEditingOptions(reply.id)} className="  p-2 ">
                          <KebabButton />
                        </div>
                      )}
                      {replyEditorToggle[reply.id] && (
                        <div className="w-[82px] md:w-[105px] right-0 absolute flex flex-col justify-center text-body4 md:text-body2 font-regular items-center border-main-400 bg-white shadow-lg border rounded-lg z-50">
                          <button
                            className="h-9 md:h-11  w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                            onClick={() => toggleReplyEditing(reply.id, reply.reply)}
                          >
                            댓글 수정
                          </button>
                          <button
                            className="h-9 md:h-11  w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                            onClick={() => setConfirmModal(true)}
                          >
                            댓글 삭제
                          </button>
                          {confirmModal && (
                            <ConfirmModal
                              isOpen={confirmModal}
                              onClose={() => setConfirmModal(false)}
                              onConfirm={() => handleReplyDelete(reply.id, reply.user_id, reply.comment_id)}
                              message={COMMENT_DELETE_CONFIRM_TEXT}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {replyEditor[reply.id] ? (
                <>
                  <div className="border border-neutral-100  rounded-[12px] bg-white ">
                    <MDEditor
                      value={replyRetouch}
                      onChange={changReplyRetouch}
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
                    {replyRetouch === reply.reply ? (
                      <>
                        <Chip
                          intent="gray"
                          size="medium"
                          label="취소"
                          onClick={() => setReplyEditor({ [reply.id]: false })}
                        />
                        <Chip intent="primary_disabled" size="medium" label="수정" />
                      </>
                    ) : (
                      <>
                        <Chip intent="gray" size="medium" label="취소" onClick={() => setReplyCancelModal(true)} />
                        <Chip
                          intent="primary"
                          size="medium"
                          label="수정"
                          onClick={() => replyRetouchHandle(reply.id, reply.user_id)}
                        />
                      </>
                    )}

                    {replyCancelModal && (
                      <ConfirmModal
                        isOpen={replyCancelModal}
                        onClose={() => setReplyCancelModal(false)}
                        onConfirm={() => setReplyEditor({ [reply.id]: false })}
                        message={'댓글을 수정 하시겠습니까?'}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2  md:gap-4 w-full text-body3 md:text-body1 font-regular whitespace-pre-wrap break-words text-neutral-900">
                  {replyLength ? (
                    <p>{filterSlang(reply.reply)}</p>
                  ) : (
                    <div className="flex flex-col justify-start items-start">
                      <p className="w-full">{cutText(filterSlang(reply.reply), 140)}</p>
                      {reply.reply.length > 145 && (
                        <button
                          className="text-subtitle3 md:text-subtitle2 font-bold md:mt-4 mt-2 text-neutral-700"
                          onClick={() => setReplyLength(true)}
                        >
                          ...더보기
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-body3 md:text-body1 font-regular text-neutral-400">
                    {reply.created_at.slice(0, 10).replace(/-/g, '.')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <ReplyPageBtn page={page} setPage={setPage} totalPage={totalPage} />
    </div>
  );
};

export default ForumReply;
