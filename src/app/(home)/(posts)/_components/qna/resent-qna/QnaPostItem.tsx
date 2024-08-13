import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import BlueCheck from '@/assets/images/common/BlueCheck';
import CommentBubble from '@/assets/images/common/CommentBubble';
import Dot from '@/assets/images/common/Dot';
import { cutText, processMarkdown } from '@/utils/markdownCut';
import { timeForToday } from '@/utils/timeForToday';
import { Post } from '@/types/posts/qnaTypes';
import { memo } from 'react';

const QnaPostItem = ({ post }: { post: Post }) => (
  <li className="border-b border-neutral-100 p-5">
    <Link href={`/qna/${post.id}`} className="block">
      <div className="flex items-center mb-5">
        <div className="relative w-10 h-10">
          <Image
            src={post.user.profile_image}
            alt={post.user.nickname || 'Unknown User'}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="ml-2 flex items-center">
          <p className="text-body1 font-medium text-neutral-900 mr-2">{post.user.nickname}</p>
          <Dot />
          <p className="text-body1 font-regular text-neutral-500 ml-2"> {timeForToday(post.created_at)}</p>
          <div className="ml-2">{post.selected_comment !== null && <BlueCheck />}</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-h5 font-bold text-neutral-900">{cutText(post.title, 50)}</h2>
      </div>
      <div className="mt-2 text-neutral-700 mb-5" data-color-mode="light">
        <MDEditor.Markdown source={processMarkdown(post.content, 300)} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5 max-h-[40px] overflow-hidden">
        {post.qna_tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-neutral-50 px-3 py-1 rounded text-subtitle2 font-medium text-neutral-700"
            style={{ maxWidth: '100%' }}
          >
            #{tag.tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <p className="text-body1 font-regular text-main-400">좋아요 {post.qna_like[0]?.count || 0}</p>
          <div className="w-0.5 h-[18px] bg-neutral-100" />
          <p className="text-body1 font-regular next-neutral-300">답변 {post.qna_comment[0]?.count || 0}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-body1 mt-1 font-regular text-neutral-400">
        <div className="flex items-center">{dayjs(post.created_at).format('YYYY-MM-DD')}</div>
        <div className="flex items-center">
          <CommentBubble />
          {post.qna_reply[0]?.count || 0}
        </div>
      </div>
    </Link>
  </li>
);

export default memo(QnaPostItem);
