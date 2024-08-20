'use client';

import KebabButton from '@/assets/images/common/KebabButton';
import { useAuth } from '@/context/auth.context';
import { timeForToday } from '@/utils/timeForToday';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { revalidate } from '@/actions/revalidate';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { archiveReplyType, replyRetouch } from '@/types/posts/archiveDetailTypes';
import ReplyPageButton from './ReplyPageButton';
import { cutText, filterSlang } from '@/utils/markdownCut';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import ArchiveDetailSkeleton from './skeleton/ArchiveDetailSkeleton';

const ArchiveReply = ({ comment_id, post_user_id }: { comment_id: string; post_user_id: string }) => {
  const { me } = useAuth();
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(0);
  const queryClient = useQueryClient();
  const [replyRetouch, setReplyRetouch] = useState<string>('');
  const [replyEditor, setReplyEditor] = useState<{ [key: string]: boolean }>({});
  const [replyEditorToggle, setReplyEditorToggle] = useState<{ [key: string]: boolean }>({});
  const [confirmModal, setConfirmModal] = useState<{ [key: string]: boolean }>({});
  const [replyLength, setReplyLength] = useState<boolean>(false);

  const COMMENT_REPLY_PAGE = 5;

  const replyRetouchMutation = useMutation({
    mutationFn: async ({ id, user_id, replyRetouch }: replyRetouch) => {
      const response = await fetch(`/api/posts/archive-detail/archive-reply/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id, user_id, replyRetouch }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update reply');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveCommentReply', comment_id] });
    }
  });

  const replyRetouchHandle = async (id: string, user_id: string) => {
    if (!replyRetouch) {
      toast.error('댓글을 입력해주세요', {
        autoClose: 2000
      });
      return;
    }

    replyRetouchMutation.mutate({ id, user_id, replyRetouch });
    setReplyEditor({ [id]: false });
  };

  const commentDelete = useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      const response = await fetch(`/api/posts/archive-detail/archive-reply/${params.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id, user_id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveCommentReply', comment_id] });
      revalidate('/', 'page');
    }
  });

  const handleReplyDelete = async (id: string, user_id: string) => {
    commentDelete.mutate({ id, user_id });
  };

  const {
    fetchNextPage,
    data: reply,
    isPending
  } = useInfiniteQuery({
    queryKey: ['archiveCommentReply', comment_id],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/posts/archive-detail/archive-reply/${comment_id}?page=${pageParam}`);

      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }

      const data = await response.json();
      return data as archiveReplyType;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage * COMMENT_REPLY_PAGE < lastPage.count ? nextPage : undefined;
    }
  });
  if (isPending) {
    return <ArchiveDetailSkeleton />;
  }

  const replyCount = reply?.pages[0].count;
  const totalPage = Math.ceil((replyCount as number) / COMMENT_REPLY_PAGE);

  const changeReplyRetouch = (value?: string) => {
    setReplyRetouch(value!);
  };

  const toggleReplyEditing = (id: string, reply: string) => {
    setReplyEditor({ [id]: true });
    setReplyEditorToggle({ [id]: !replyEditorToggle[id] });
    setReplyRetouch(reply);
  };

  const toggleEditingOptions = (id: string) => {
    setReplyEditorToggle({ [id]: !replyEditorToggle[id] });
  };

  const handleCancelEdit = (id: string) => {
    setConfirmModal((prev) => ({ ...prev, [id]: true }));
  };

  const handleConfirmCancelEdit = (id: string) => {
    setReplyEditor({ [id]: false });
    setConfirmModal((prev) => ({ ...prev, [id]: false }));
  };

  const handleCloseModal = (id: string) => {
    setConfirmModal((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div>
      <Default>
        {reply?.pages[page]?.reply.map((reply) => (
          <div key={reply.id} className="w-full">
            {reply.comment_id === comment_id && (
              <div
                key={reply.id}
                className={`flex flex-col justify-between border-l-4 border-[#C7DCF5] border-b-[1px] gap-4 p-6 ${
                  reply.user_id === me?.id ? 'bg-[#F2F7FD]' : 'bg-white'
                }`}
              >
                <div className="flex justify-between ">
                  <div className="flex justify-start items-center gap-4">
                    <Image
                      src={reply.user.profile_image}
                      alt="replyUserImage"
                      width={48}
                      height={48}
                      className="rounded-full "
                    />
                    <div className="flex flex-col gap-1">
                      {post_user_id === reply.user_id && (
                        <p className="w-[66px] h-[30px] text-subtitle2 font-medium px-[12px] py-[4px] text-white bg-main-500 text-center rounded-[4px]">
                          글쓴이
                        </p>
                      )}
                      <p className="text-subtitle1 font-medium">{reply.user.nickname}</p>
                      <p className="text-body2 font-regular text-neutral-400">{timeForToday(reply.updated_at)}</p>
                    </div>
                  </div>
                  <div className="relative">
                    {me?.id === reply.user_id && (
                      <>
                        {!replyEditor[reply.id] && (
                          <div onClick={() => toggleEditingOptions(reply.id)} className="p-4">
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
                              onClick={() => setConfirmModal((prev) => ({ ...prev, [reply.id]: true }))}
                            >
                              댓글 삭제
                            </button>
                            {confirmModal[reply.id] && (
                              <ConfirmModal
                                isOpen={confirmModal[reply.id]}
                                onClose={() => setConfirmModal((prev) => ({ ...prev, [reply.id]: false }))}
                                onConfirm={() => handleReplyDelete(reply.id, reply.user_id)}
                                message={'댓글을 삭제 할까요?'}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {replyEditor[reply.id] ? (
                  <div className="flex flex-col min-h-[200px] mb-6 mx-5 mt-4 gap-4">
                    <div className="border border-neutral-100 bg-white rounded-xl focus-within:border-main-400">
                      <MDEditor
                        value={replyRetouch}
                        onChange={changeReplyRetouch}
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
                        onClick={() => handleCancelEdit(reply.id)}
                        className="bg-neutral-50 text-neutral-100 px-5 py-3 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => replyRetouchHandle(reply.id, reply.user_id)}
                        className="bg-main-100 text-main-50 px-5 py-3 rounded-lg"
                      >
                        수정
                      </button>
                    </div>
                    {confirmModal[reply.id] && (
                      <ConfirmModal
                        isOpen={confirmModal[reply.id]}
                        onClose={() => handleCloseModal(reply.id)}
                        onConfirm={() => handleConfirmCancelEdit(reply.id)}
                        message={'댓글 작성을 중단 할까요?'}
                      />
                    )}
                  </div>
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
        <div className=" flex pt-6 gap-4 w-full mt-6 justify-end">
          <ReplyPageButton
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            fetchNextPage={fetchNextPage}
            reply={reply}
          />
        </div>
      </Default>
      <Mobile>
        <div className="flex flex-col justify-end items-end mx-5">
          {reply?.pages[page]?.reply.map((reply) => (
            <div key={reply.id} className="w-full">
              {reply.comment_id === comment_id && (
                <div
                  key={reply.id}
                  className={`flex flex-col justify-between border-l-4 border-[#C7DCF5] border-b-[1px] gap-4 p-6 ${
                    reply.user_id === me?.id ? 'bg-[#F2F7FD]' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between ">
                    <div className="flex justify-start items-center gap-4">
                      <Image
                        src={reply.user.profile_image}
                        alt="replyUserImage"
                        width={36}
                        height={36}
                        className="rounded-full "
                      />
                      <div className="flex flex-col gap-1">
                        {post_user_id === reply.user_id && (
                          <p className="w-[34px] h-[19px] text-white text-subtitle4 font-semibold  bg-main-400 text-center rounded-[4px]">
                            글쓴이
                          </p>
                        )}
                        <p className="body4-medium-13px text-neutral-900">{reply.user.nickname}</p>
                        <p className="body4-regular-13px text-neutral-300">{timeForToday(reply.updated_at)}</p>
                      </div>
                    </div>
                    <div className="relative">
                      {me?.id === reply.user_id && (
                        <>
                          {!replyEditor[reply.id] && (
                            <div onClick={() => toggleEditingOptions(reply.id)} className="p-2">
                              <KebabButton />
                            </div>
                          )}
                          {replyEditorToggle[reply.id] && (
                            <div className="w-[82px] right-0 absolute flex flex-col justify-center items-center border-main-400 bg-white shadow-lg border rounded-lg">
                              <button
                                className="h-9 w-full rounded-t-lg hover:bg-main-50 hover:text-main-400"
                                onClick={() => toggleReplyEditing(reply.id, reply.reply)}
                              >
                                댓글 수정
                              </button>
                              <button
                                className="h-9 w-full rounded-b-lg hover:bg-main-50 hover:text-main-400"
                                onClick={() => setConfirmModal((prev) => ({ ...prev, [reply.id]: true }))}
                              >
                                댓글 삭제
                              </button>
                              {confirmModal[reply.id] && (
                                <ConfirmModal
                                  isOpen={confirmModal[reply.id]}
                                  onClose={() => setConfirmModal((prev) => ({ ...prev, [reply.id]: false }))}
                                  onConfirm={() => handleReplyDelete(reply.id, reply.user_id)}
                                  message={'댓글을 삭제 할까요?'}
                                />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {replyEditor[reply.id] ? (
                    <div className="flex flex-col w-full min-h-[200px] mt-4 gap-4">
                      <div className="border border-neutral-100 bg-white rounded-xl focus-within:border-main-400">
                        <MDEditor
                          value={replyRetouch}
                          onChange={changeReplyRetouch}
                          preview="edit"
                          extraCommands={commands.getCommands().filter(() => false)}
                          commands={commands.getCommands().filter((command) => {
                            return command.name !== 'image';
                          })}
                          textareaProps={{ maxLength: 1000 }}
                          height={'auto'}
                        />
                      </div>
                      <div className="flex justify-end items-end mt-4 gap-4">
                        <button
                          onClick={() => handleCancelEdit(reply.id)}
                          className="bg-neutral-50 text-neutral-100  py-2 px-4 rounded-lg"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => replyRetouchHandle(reply.id, reply.user_id)}
                          className="bg-main-100 text-main-50  py-2 px-4 rounded-lg"
                        >
                          수정
                        </button>
                      </div>
                      {confirmModal[reply.id] && (
                        <ConfirmModal
                          isOpen={confirmModal[reply.id]}
                          onClose={() => handleCloseModal(reply.id)}
                          onConfirm={() => handleConfirmCancelEdit(reply.id)}
                          message={'댓글 작성을 중단 할까요?'}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full text-body3 font-regular whitespace-pre-wrap break-words text-neutral-900">
                      {replyLength ? (
                        <p className="text-body1 font-regular text-wrap break-all  ">{filterSlang(reply.reply)}</p>
                      ) : (
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-body1 font-regular text-wrap break-all  ">
                            {cutText(filterSlang(reply.reply), 140)}
                          </p>
                          {reply.reply.length > 145 ? (
                            <button
                              className="text-subtitle3 font-bold mt-2 text-neutral-700"
                              onClick={() => setReplyLength(true)}
                            >
                              ...더보기
                            </button>
                          ) : null}
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
          <div className=" flex pt-6 gap-4 w-full mt-6 justify-end">
            <ReplyPageButton
              page={page}
              setPage={setPage}
              totalPage={totalPage}
              fetchNextPage={fetchNextPage}
              reply={reply}
            />
          </div>
        </div>
      </Mobile>
    </div>
  );
};

export default ArchiveReply;
