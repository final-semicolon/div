'use client';

import KebabButton from '@/assets/images/common/KebabButton';
import { useAuth } from '@/context/auth.context';
import { forumReplyType, replyRetouch } from '@/types/posts/forumDetailTypes';
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
    if (!replyRetouch) {
      toast.error('댓글을 입력해주세요!', {
        autoClose: 2000
      });
      return;
    }
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
        await queryClient.setQueryData(['forumComments', params.id, commentsPage], (oldData: any) => {
          const newComment = oldData.data.map((comment: any) =>
            comment.id === comment_id ? { ...comment, reply: [{ count: data?.replyCount }] } : comment
          );
          return { ...oldData, data: newComment };
        });
      }
      toast.success(COMMENT_DELETE_ALRERT_TEXT);
    }
  });

  const handleReplyDelete = async (id: string, user_id: string, comment_id: string) => {
    commentDelete.mutate({ id, user_id, comment_id });
  };

  //대댓글 가져오기
  const {
    data: reply,
    isPending,
    error
  } = useQuery({
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
    return <div>loading...</div>;
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
    <div className="flex flex-col justify-end items-end">
      {reply?.reply.map((reply) => (
        <div key={reply.id} className="w-full">
          {reply.comment_id === comment_id && (
            <div
              key={reply.id}
              className={`flex flex-col justify-between  border-l-4 border-[#C7DCF5] border-b-[1px] gap-4 p-6 ${reply.user_id === me?.id ? 'bg-[#F2F7FD]' : 'bg-white'}`}
            >
              <div className="flex justify-between ">
                <div className=" flex justify-start items-center gap-4">
                  <Image
                    src={reply.user.profile_image}
                    alt="replyUserImage"
                    width={48}
                    height={48}
                    className="rounded-full "
                  />
                  <div className=" flex flex-col">
                    {post_user_id === reply.user_id && (
                      <p className=" text-subtitle2 font-medium  px-[12px] py-[4px] text-white bg-main-500 text-center rounded-[4px]  ">
                        글쓴이
                      </p>
                    )}
                    <p className="text-subtitle1 font-medium">{reply.user.nickname}</p>
                    <p className="text-body2 font-regular">{timeForToday(reply.updated_at)}</p>
                  </div>
                </div>
                <div className=" relative  ">
                  {me?.id === reply.user_id && (
                    <>
                      {replyEditor[reply.id] ? null : (
                        <div onClick={() => toggleEditingOptions(reply.id)} className="  p-4 ">
                          <KebabButton />
                        </div>
                      )}
                      {replyEditorToggle[reply.id] && (
                        <div className="w-[105px] right-0 absolute flex flex-col justify-center items-center border-main-400 bg-white shadow-lg border rounded-lg">
                          <button
                            className="h-[44px] w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                            onClick={() => toggleReplyEditing(reply.id, reply.reply)}
                          >
                            댓글 수정
                          </button>
                          <button
                            className="h-[44px] w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
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
                <div className="flex flex-col  gap-4">
                  {replyLength ? (
                    <p className="text-body1 font-regular text-wrap break-all  ">{filterSlang(reply.reply)}</p>
                  ) : (
                    <div className="flex flex-col justify-start items-start">
                      <p className="text-body1 font-regular text-wrap break-all  ">
                        {cutText(filterSlang(reply.reply), 140)}
                      </p>
                      {reply.reply.length > 145 ? (
                        <button
                          className="text-subtitle2 font-bold text-neutral-700"
                          onClick={() => setReplyLength(true)}
                        >
                          ...더보기
                        </button>
                      ) : null}
                    </div>
                  )}

                  <p className="text-body1 font-regular text-neutral-400">
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
