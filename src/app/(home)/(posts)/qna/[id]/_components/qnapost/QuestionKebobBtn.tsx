import { revalidatePostTag } from '@/actions/revalidatePostTag';
import KebabButton from '@/assets/images/common/KebabButton';
import { useQnaDetailStore } from '@/store/qnaDetailStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const QuestionKebobBtn = () => {
  const router = useRouter();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const { postId } = useQnaDetailStore();

  const deletePost = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/qna-detail/${postId}`, {
      method: 'DELETE'
    });
    const { data, message } = await response.json();
    if (message) {
      return toast.error(message);
    }
    await revalidatePostTag(`qna-detail-${postId}`);
    toast.success('글 삭제 완료', { autoClose: 1500, hideProgressBar: true });
    router.push(`/edit/${postId}/?category=qna`);
    return;
  };

  return (
    <>
      <div className=" relative">
        <button
          className="w-[20px]"
          onClick={() => {
            setOpenKebab((prev) => !prev);
          }}
        >
          <KebabButton />
        </button>
        <ul
          className={`${openKebab ? 'border border-neutral-100 bg-white' : 'hidden'} rounded-lg flex flex-col absolute w-[105px] h-[88px] right-0 text-center hover:border-main-400 text-body2`}
        >
          <li
            className={`h-[44px] content-center ${openKebab ? '' : 'hidden'} hover:bg-main-100 hover:text-main-400 rounded-t-lg cursor-pointer`}
            onClick={() => {
              router.push(`/edit/${postId}/?category=qna`);
            }}
          >
            게시글 수정
          </li>
          <li
            className={`h-[44px]  content-center ${openKebab ? '' : 'hidden'}  hover:bg-main-100 hover:text-main-400 rounded-b-lg cursor-pointer`}
            onClick={deletePost}
          >
            게시글 삭제
          </li>
        </ul>
      </div>
    </>
  );
};

export default QuestionKebobBtn;
