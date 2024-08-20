'use client';

import FilledLike from '@/assets/images/like/FilledLike';
import UnfilledLike from '@/assets/images/like/UnfilledLike';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

type LikeButtonProps = {
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
};

const NewLikeButton = ({ isLiked, likeCount, onClick }: LikeButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center">
      {isLiked ? <FilledLike /> : <UnfilledLike />}
      <Default>
        <span className="ml-1 text-subtitle1 font-medium text-neutral-400">{likeCount}</span>
      </Default>
      <Mobile>
        <span className="ml-[2px] text-body3 font-medium text-neutral-400">{likeCount}</span>
      </Mobile>
    </button>
  );
};

export default NewLikeButton;
