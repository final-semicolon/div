'use client';

import FilledLike from '@/assets/images/like/FilledLike';
import UnfilledLike from '@/assets/images/like/UnfilledLike';

type LikeButtonProps = {
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
};

const NewLikeButton = ({ isLiked, likeCount, onClick }: LikeButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center">
      {isLiked ? <FilledLike /> : <UnfilledLike />}
      <span className="ml-1 text-subtitle1 font-medium text-neutral-400">{likeCount}</span>
    </button>
  );
};

export default NewLikeButton;
