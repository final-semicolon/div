import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { processMarkdown } from '@/utils/markdownCut';
import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';
import { memo } from 'react';

const PopularQnaPostItem = ({ post, index, startIndex }: { post: any; index: number; startIndex: number }) => (
  <>
    <Default>
      <Link key={post.id} href={`/qna/${post.id}`}>
        <li
          className={`border-t border-b border-neutral-100 p-4 flex flex-col min-h-[158px] ${
            index % 2 === 0 ? 'border-r' : 'border-l'
          }`}
        >
          <div className="flex justify-start items-center mb-5">
            <p className="text-h5 font-bold text-left text-main-500">{startIndex + index + 1}</p>
            <p className="ml-2 text-h5 font-bold text-left text-neutral-900 line-clamp-1">{post.title}</p>
          </div>
          <div className="text-subtitle1 font-medium text-left text-neutral-300 mb-5" data-color-mode="light">
            <MDEditor.Markdown source={processMarkdown(post.content, 30)} />
          </div>
          <div className="mt-auto">
            <div className="flex justify-start items-center gap-2">
              <div className="flex items-center gap-1">
                <p className="text-body1 text-left text-main-500">좋아요</p>
                <p className="text-body1 text-left text-main-500">{post.qna_like?.[0]?.count || 0}</p>
              </div>
              <div className="w-0.5 h-[18px] bg-neutral-200" />
              <div className="flex items-center gap-1">
                <p className="text-body1 text-left text-neutral-300">답변수</p>
                <p className="text-body1 text-left text-neutral-300">{post.qna_comment?.[0]?.count || 0}</p>
              </div>
            </div>
          </div>
        </li>
      </Link>
    </Default>
    <Mobile>
      <Link key={post.id} href={`/qna/${post.id}`}>
        <li className={`border-b border-neutral-50 p-5 flex flex-col min-h-[117px] `}>
          <div className="flex justify-start items-center mb-[8px]">
            <p className="text-subtitle3 font-bold text-left text-main-500">{startIndex + index + 1}.</p>
            <p className="ml-1 text-subtitle3 font-bold text-left text-neutral-900 line-clamp-1">{post.title}</p>
          </div>
          <div className="text-body3 font-medium text-left text-neutral-300 mb-[8px]" data-color-mode="light">
            <MDEditor.Markdown source={processMarkdown(post.content, 30)} />
          </div>
          <div className="mt-auto">
            <div className="flex justify-start items-center gap-2">
              <div className="flex items-center gap-1">
                <p className="text-body3 text-left text-main-500">좋아요</p>
                <p className="text-body3 text-left text-main-500">{post.qna_like?.[0]?.count || 0}</p>
              </div>
              <div className="w-0.5 h-[18px] bg-neutral-200" />
              <div className="flex items-center gap-1">
                <p className="text-body3 text-left text-neutral-300">답변수</p>
                <p className="text-body3 text-left text-neutral-300">{post.qna_comment?.[0]?.count || 0}</p>
              </div>
            </div>
          </div>
        </li>
      </Link>
    </Mobile>
  </>
);

export default memo(PopularQnaPostItem);
