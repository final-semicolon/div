import Image from 'next/image';
import Dot from '@/assets/images/common/Dot';
import { PostCardProps } from '@/types/posts/forumTypes';
import { timeForToday } from '@/utils/timeForToday';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const PostHeader = ({ post }: PostCardProps) => (
  <>
    <Default>
      <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[48px] gap-4 py-1 z-10">
        <div className="relative w-10 h-10 ">
          {post.user.profile_image && (
            <Image
              src={post.user.profile_image}
              alt="User Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-1">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
            <p className="flex-grow font-medium text-subtitle1 text-left text-neutral-900">{post.user.nickname}</p>
          </div>
          <div className="flex justify-start items-center self-stretch flex-grow relative gap-2">
            <p className="flex-grow-0 font-regular flex-shrink-0 text-body2 text-left text-neutral-300">
              {post.forum_category}
            </p>
            <Dot />
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
              <p className="flex-grow-0 font-regular flex-shrink-0 text-body2 text-left text-neutral-300">
                {timeForToday(post.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Default>
    <Mobile>
      <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[39px] gap-3 mb-5 z-10">
        <div className="relative w-9 h-9 ">
          {post.user.profile_image && (
            <Image
              src={post.user.profile_image}
              alt="User Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
            <p className="flex-grow font-medium text-subtitle3 text-left text-neutral-900">{post.user.nickname}</p>
          </div>
          <div className="flex justify-start items-center self-stretch flex-grow relative gap-1">
            <p className="flex-grow-0 font-regular flex-shrink-0 text-body4 text-left text-neutral-300">
              {post.forum_category}
            </p>
            <Dot />
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
              <p className="flex-grow-0 font-regular flex-shrink-0 text-body4 text-left text-neutral-300">
                {timeForToday(post.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Mobile>
  </>
);

export default PostHeader;
