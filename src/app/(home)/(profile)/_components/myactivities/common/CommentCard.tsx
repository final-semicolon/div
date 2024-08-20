import { filterSlang } from '@/utils/markdownCut';
import dayjs from 'dayjs';
import Link from 'next/link';

type CommentCardProps = {
  id: string;
  post_id: string;
  title: string;
  comment: string;
  category: string;
  nickname: string;
  created_at: string;
  forum_category: string;
  likesCount: string;
  commentsCount: string;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
};

const CommentCard = ({
  id,
  post_id,
  title,
  comment,
  category,
  nickname,
  isSelected,
  forum_category,
  likesCount,
  commentsCount,
  created_at,
  onCheckboxChange
}: CommentCardProps) => {
  const formattedTime = new Date(created_at).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-w-[375px] max-w-[850px] border-b p-4 ">
      <div className="flex">
        <div className="mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onCheckboxChange(id)}
            className="w-[18px] h-[18px]"
          />
        </div>
        <Link href={`/${category}/${post_id}`}>
          <div className="">
            <p className="mb-2 text-neutral-900 text-subtitle3 md:text-subtitle1 font-bold line-clamp-1 max-w-[600px]">
              {filterSlang(comment)}
            </p>
            <p className="text-neutral-400 text-body4 md:text-body1 funt-regular my-1 md:my-2">
              원문 제목: {filterSlang(title)} [{commentsCount}]
            </p>
            {forum_category && (
              <p className="text-body4 md:text-body2 font-regular text-neutral-400">{forum_category}</p>
            )}
            <div className="text-body4 md:text-body2 font-regular">
              <span className=" text-neutral-400">
                {nickname}
                <span className=" text-neutral-100 mx-2">•</span>
                {dayjs(created_at).format('YYYY. MM. DD')}
                <span className=" text-neutral-100 mx-2">•</span>
                {formattedTime}
                <span className=" text-neutral-100 mx-2"> • </span> 좋아요 {likesCount}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CommentCard;
