import React from 'react';

type Props = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  archiveCount: number;
  forumCount: number;
  qnaCount: number;
};

const PostCountDisplay: React.FC<Props> = ({ primaryCategory, archiveCount, forumCount, qnaCount }) => {
  const getDisplayText = () => {
    switch (primaryCategory) {
      case 'archive':
        return {
          label: '아카이브 게시글',
          count: archiveCount
        };
      case 'forum':
        return {
          label: '포럼 게시글',
          count: forumCount
        };
      case 'qna':
        return {
          label: 'Q&A 게시글',
          count: qnaCount
        };
      default:
        return {
          label: '전체 게시글',
          count: archiveCount + forumCount + qnaCount
        };
    }
  };

  const { label, count } = getDisplayText();

  return (
    <div>
      <span className="text-subtitle1 font-medium text-neutral-700">{label}</span>
      <span className="text-subtitle1 font-bold text-neutral-800"> ({count}) </span>
    </div>
  );
};

export default PostCountDisplay;
