import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import BlueCheck from '@/assets/images/common/BlueCheck';
import CommentBubble from '@/assets/images/common/CommentBubble';
import Dot from '@/assets/images/common/Dot';
import { cutText, processMarkdown } from '@/utils/markdownCut';
import { timeForToday } from '@/utils/timeForToday';
import { Post, SelectedPost } from '@/types/posts/qnaTypes';
import { memo } from 'react';
import FilledLike from '@/assets/images/like/FilledLike';

const QnaPostItemSelected = ({ post }: { post: SelectedPost }) => (
  <li className="border-b border-neutral-100 p-5">
    <Link href={`/qna/${post.id}`} className="block">
      <div className="mb-4">
        <div className="flex items-start mb-5 min-h-[27px] overflow-hidden">
          <h2 className="flex text-h5 font-bold text-sub-200 mr-[2px]">Q.</h2>
          <h2 className="flex text-h5 font-bold text-neutral-900">{cutText(post.title, 80)}</h2>
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
          <div className="flex flex-wrap gap-1.5 max-h-[40px] overflow-hidden">
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
      </div>
      <div className="w-[1164px] h-[193px] bg-sub-50 mb-5 rounded-xl">
        <div className="mx-4 pt-4">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12">
              <Image
                src={post.selected_comment_data!.user.profile_image}
                alt={post.user.nickname || 'Unknown User'}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="ml-2 flex items-center">
              <p className="text-subtitle1 font-medium text-neutral-900">{post.selected_comment_data!.user.nickname}</p>
              <div className="ml-2">
                <BlueCheck />
              </div>
            </div>
          </div>
          <div className="flex-grow mb-4 min-h-[54px]">
            <MDEditor.Markdown source={processMarkdown(post.selected_comment_data!.comment, 160)} />
          </div>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <p className="flex items-center text-body1 font-regular text-neutral-400">
                <div className="flex mr-1">
                  <FilledLike />
                </div>
                {post.selected_comment_data!.qna_comment_likes[0]?.count || 0}
              </p>
              <p className="flex items-center text-body1 font-regular text-neutral-400">
                <div className="flex mr-1">
                  <CommentBubble />
                </div>
                {post.selected_comment_data!.qna_reply[0]?.count || 0}
              </p>
            </div>

            <div className="text-body1 font-regular text-neutral-400 ml-4">
              {dayjs(post.selected_comment_data!.created_at).format('YYYY.MM.DD')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  </li>
);

export default memo(QnaPostItemSelected);
