import Image from 'next/image';
import BookmarkButton from '@/components/common/BookmarkButton';
import { Post } from '@/types/posts/archiveTypes';
import { cutText } from '@/utils/markdownCut';
import DefaultThumbnail from '../../../../../../public/images/archive/default_thumbnail.png';
import { useRouter } from 'next/navigation';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import ArchiveBookmarkButton from './ArchiveBookmarkButton';
import Tag from '@/components/common/Tag';
import TagBlock from '@/components/common/TagBlock';

const ArchivePostCard = ({ post }: { post: Post }) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/archive/${post.id}`);
  };

  return (
    <>
      <Default>
        <div
          className="flex flex-col justify-start items-start w-[388px] h-[414px] relative rounded-xl bg-white"
          onClick={handlePostClick}
        >
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl mb-2">
            <Image
              src={post.thumbnail || DefaultThumbnail}
              alt="Post Thumbnail"
              width={1552}
              height={1120}
              className="w-[388px] h-[280px] object-cover rounded-xl"
            />
            <div className="absolute top-4 right-4">
              <BookmarkButton id={post.id} type="archive" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start self-stretch relative h-[126px]">
            <div className="text-body1 font-bold text-neutral-900 mx-5 my-2">{cutText(post.title, 20)}</div>
            <div className="text-body2 font-regular text-neutral-700 mx-5 mb-2">
              {post.user.nickname
                ? post.user.nickname.length > 20
                  ? `${post.user.nickname.slice(0, 20)}...`
                  : post.user.nickname
                : 'unknown user'}
            </div>
          </div>
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap min-h-[46px] gap-[6px] overflow-hidden mx-5 mb-2">
            {post.archive_tags && post.archive_tags.length > 0 ? (
              post.archive_tags
                .filter((tag) => tag.tag !== null)
                .map((tag) => <TagBlock key={tag.id} tag={tag.tag || ''} />)
            ) : (
              <span className="h-[46px]"></span>
            )}
          </div>
        </div>
      </Default>
      <Mobile>
        <div
          className="flex flex-col justify-start items-start w-[264px] h-[280px] relative rounded-xl bg-white"
          onClick={handlePostClick}
        >
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-xl">
            <Image
              src={post.thumbnail || DefaultThumbnail}
              alt="Post Thumbnail"
              width={528}
              height={342}
              className="w-[264px] h-[171px] object-cover rounded-xl"
            />
            <div className="absolute top-4 right-4">
              <ArchiveBookmarkButton id={post.id} type="archive" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start self-stretch relative h-[109px]">
            <div className="text-subtitle2 font-bold text-neutral-900 mx-5 mt-3 mb-2">{cutText(post.title, 20)}</div>
            <div className=" text-body3 font-regular text-neutral-700 mx-5 mb-2">
              {post.user.nickname
                ? post.user.nickname.length > 20
                  ? `${post.user.nickname.slice(0, 20)}...`
                  : post.user.nickname
                : 'unknown user'}
            </div>
            <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap min-h-[26px] gap-[6px] overflow-hidden mx-5 mb-2">
              {post.archive_tags && post.archive_tags.length > 0 ? (
                post.archive_tags
                  .filter((tag) => tag.tag !== null)
                  .map((tag) => <TagBlock key={tag.id} tag={tag.tag || ''} />)
              ) : (
                <span className="h-[26px]"></span>
              )}
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default ArchivePostCard;
