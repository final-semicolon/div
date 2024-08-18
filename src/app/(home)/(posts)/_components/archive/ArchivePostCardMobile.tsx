'use client';

import Image from 'next/image';
import BookmarkButton from '@/components/common/BookmarkButton';
import { Post } from '@/types/posts/archiveTypes';
import { cutText } from '@/utils/markdownCut';
import DefaultThumbnail from '../../../../../../public/images/archive/default_thumbnail.png';
import { useRouter } from 'next/navigation';
import { Mobile } from '@/hooks/common/useMediaQuery';
import ArchiveBookmarkButton from './ArchiveBookmarkButton';

const ArchivePostCardMobile = ({ post }: { post: Post }) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/archive/${post.id}`);
  };

  return (
    <>
      <Mobile>
        <div
          className="flex flex-col justify-start items-start w-[335px] h-[234px] relative rounded-t-xl border-b mb-5 bg-white"
          onClick={handlePostClick}
        >
          <div className="flex-grow-0 flex-shrink-0 relative border rounded-t-xl">
            <Image
              src={post.thumbnail || DefaultThumbnail}
              alt="Post Thumbnail"
              width={670}
              height={250}
              className="w-[335px] h-[125px] object-cover rounded-t-xl"
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
            <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap h-[26px] overflow-hidden mx-5 mb-3">
              {post.archive_tags && post.archive_tags.length > 0 ? (
                post.archive_tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-neutral-50 px-2 py-1 rounded text-caption font-regular text-neutral-700 mr-2"
                    style={{ maxWidth: '100%' }}
                  >
                    #{tag.tag}
                  </span>
                ))
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

export default ArchivePostCardMobile;
