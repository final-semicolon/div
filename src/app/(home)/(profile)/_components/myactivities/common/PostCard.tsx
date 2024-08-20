import VectorImageIcon from '@/assets/images/common/VectorImageIcon';
import { filterSlang } from '@/utils/markdownCut';
import dayjs from 'dayjs';
import Link from 'next/link';

type PostCardProps = {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  created_at: string;
  category: string;
  likesCount: string;
  commentsCount: string;
  forum_category: string;
  nickname: string;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
};

const PostCard = ({
  id,
  title,
  content,
  thumbnail,
  tags,
  created_at,
  category,
  likesCount,
  commentsCount,
  forum_category,
  nickname,
  isSelected,
  onCheckboxChange
}: PostCardProps) => {
  const formattedTime = new Date(created_at).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-w-[375px] max-w-[850px] border-b p-4 ">
      <div className="flex ">
        <div className="mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onCheckboxChange(id)}
            className="w-[18px] h-[18px]"
          />
        </div>
        <Link href={`/${category}/${id}`}>
          <div className="">
            <div className="flex items-center mb-2">
              <span className="text-neutral-900 text-subtitle3 md:text-subtitle1 font-bold line-clamp-1 max-w-[600px]">
                {filterSlang(title)}
              </span>
              <span className="flex items-center ml-3">
                {thumbnail ? <VectorImageIcon /> : <div></div>}
                <span className="text-main-400 text-subtitle3 md:text-subtitle1 font-medium ml-1">
                  [{commentsCount || '0'}]
                </span>
              </span>
            </div>
            <p className="text-body4 md:text-body1 font-regular text-neutral-400 line-clamp-2 md:line-clamp-1 mb-2">
              {filterSlang(content)}
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
            {tags.length > 0 && (
              <div className="mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className=" bg-neutral-50 text-neutral-700 text-caption2 md:text-subtitle2 font-medium rounded-[4px] p-[4px_12px] mr-[6px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
