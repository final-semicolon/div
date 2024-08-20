import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';
import dayjs from 'dayjs';
import CommentBubble from '@/assets/images/common/CommentBubble';
import { cutText, processMarkdown } from '@/utils/markdownCut';
import { Post } from '@/types/posts/qnaTypes';
import { memo } from 'react';
import FilledLike from '@/assets/images/like/FilledLike';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import TagBlock from '@/components/common/TagBlock';

const QnaPostItemWaiting = ({ post }: { post: Post }) => (
  <>
    <Default>
      <li className="border-b border-neutral-100 p-5">
        <Link href={`/qna/${post.id}`} className="block">
          <div className="flex items-start mb-5 max-h-[27px]">
            <h2 className="text-h5 font-bold text-sub-200 mr-[2px]">Q.</h2>
            <h2 className="text-h5 font-bold text-neutral-900">{cutText(post.title, 50)}</h2>
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
              {post.qna_tags && post.qna_tags.length > 0 ? (
                post.qna_tags
                  .filter((tag) => tag.tag !== null)
                  .map((tag) => <TagBlock key={tag.id} tag={tag.tag || ''} />)
              ) : (
                <span className="h-[40px]"></span>
              )}
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
    </Default>
    <Mobile>
      <li className="border-b border-neutral-100 mx-5 px-5 py-4">
        <Link href={`/qna/${post.id}`} className="block">
          <div className="flex items-start mb-3 max-h-[19px]">
            <h2 className="text-subtitle3 font-bold text-sub-200 mr-[2px]">Q.</h2>
            <h2 className="text-subtitle3 font-bold text-neutral-900">{cutText(post.title, 20)}</h2>
          </div>
          <div className="flex placeholder:mt-2 text-neutral-700 mb-3" data-color-mode="light">
            <div className="flex-grow">
              <MDEditor.Markdown source={processMarkdown(post.content, 30)} />
            </div>
            <div className="flex flex-col items-center justify-center ml-2 p-1 border rounded-md text-center min-w-[48px] h-[42px]">
              <p className="text-subtitle2 font-bold text-neutral-900">{post.qna_comment[0]?.count || 0}</p>
              <p className="text-body4 font-medium text-neutral-500">답변</p>
            </div>
          </div>
          {post.qna_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 min-h-[26px]">
              {post.qna_tags && post.qna_tags.length > 0 ? (
                post.qna_tags
                  .filter((tag) => tag.tag !== null)
                  .map((tag) => <TagBlock key={tag.id} tag={tag.tag || ''} />)
              ) : (
                <span className="h-[26px]"></span>
              )}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="flex items-center text-body3 font-regular text-neutral-400">
                <div className="flex mr-[0.5px]">
                  <FilledLike width={20} height={20} />
                </div>
                {post.qna_like[0]?.count || 0}
              </p>
              <p className="flex items-center text-body3 font-regular text-neutral-400">
                <div className="flex mr-[0.5px]">
                  <CommentBubble width={'20'} height={'20'} />
                </div>
                {post.qna_reply[0]?.count || 0}
              </p>
            </div>

            <div className="text-body3 font-regular text-neutral-400 ml-4">
              {dayjs(post.created_at).format('YYYY.MM.DD')}
            </div>
          </div>
        </Link>
      </li>
    </Mobile>
  </>
);

export default memo(QnaPostItemWaiting);
