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
import FilledLike from '@/assets/images/like/FilledLike';

const QnaPostItemWaiting = ({ post }: { post: Post }) => (
  <li className="border-b border-neutral-100 p-5">
    <Link href={`/qna/${post.id}`} className="block">
      <div className="flex items-start mb-5 max-h-[27px]">
        <h2 className="text-h5 font-bold text-sub-200 mr-[2px]">Q.</h2>
        <h2 className="text-h5 font-bold text-neutral-900">{cutText(post.title, 80)}</h2>
      </div>
      <div className="flex placeholder:mt-2 text-neutral-700 mb-5" data-color-mode="light">
        <div className="flex-grow">
          <MDEditor.Markdown source={processMarkdown(post.content, 160)} />
        </div>
        <div className="flex flex-col items-center justify-center ml-4 p-2 border rounded-md text-center min-w-[65px] h-[54px]">
          <p className="text-h5 font-bold text-neutral-900">{post.qna_comment[0]?.count || 0}</p>
          <p className="text-body2 font-medium text-neutral-500">답변</p>
        </div>
      </div>
      {post.qna_tags.length > 0 && (
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
      )}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <p className="flex items-center text-body1 font-regular text-neutral-400">
            <div className="flex mr-1">
              <FilledLike />
            </div>
            {post.qna_like[0]?.count || 0}
          </p>
          <div className="w-0.5 h-[18px] bg-neutral-100" />
          <p className="flex items-center text-body1 font-regular text-neutral-400">
            <div className="flex mr-1">
              <CommentBubble />
            </div>
            {post.qna_reply[0]?.count || 0}
          </p>
        </div>

        <div className="text-body1 font-regular text-neutral-400 ml-4">
          {dayjs(post.created_at).format('YYYY.MM.DD')}
        </div>
      </div>
    </Link>
  </li>
);

export default memo(QnaPostItemWaiting);
