'use client';

import BookmarkButton from '@/components/common/BookmarkButton';
import SortDropdown from '@/components/common/SortDropdownGrey';
import { useArchivePosts } from '@/hooks/archive/useFetchArchivePosts';
import { Post, SortOption } from '@/types/posts/archiveTypes';
import { cutText } from '@/utils/markdownCut';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DefaultThumbnail from '../../../../../../public/images/archive/default_thumbnail.png';

const ArchivePosts = () => {
  const [page, setPage] = useState(0);
  const [sortMethod, setSortMethod] = useState<SortOption>('latest');
  const POSTS_PER_PAGE = 6;
  const router = useRouter();

  const {
    data: archiveResult,
    error: archiveError,
    isPending: isPendingArchive,
    isError: isErrorArchive
  } = useArchivePosts(page, 6, sortMethod);

  const filterAndSortPosts = (posts: Post[], sortMethod: SortOption): Post[] => {
    switch (sortMethod) {
      case 'latest':
        return posts.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix());
      case 'oldest':
        return posts.sort((a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix());
      case 'mostLikes':
        return posts.sort((a, b) => (b.archive_like[0]?.count || 0) - (a.archive_like[0]?.count || 0));
      default:
        return posts;
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '과거순' },
    { value: 'mostLikes', label: '인기순' }
  ];

  if (isPendingArchive) {
    return <div>Loading...</div>;
  }

  if (isErrorArchive) {
    return <div>Error: {archiveError?.message}</div>;
  }

  const archivePosts = archiveResult?.data || [];
  const sortedPosts = filterAndSortPosts(archivePosts, sortMethod);
  const totalPages = Math.ceil((archiveResult?.count || 0) / POSTS_PER_PAGE);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(event.target.value as SortOption);
  };

  const handlePostClick = (id: string) => {
    router.push(`/archive/${id}`);
  };

  return (
    <>
      <div className="mb-9">
        <p className="text-subtitle1 text-neutral-400 font-medium mb-3">Level Up Course</p>
        <p className="text-h3 text-neutral-900 font-bold">더 많은 코드를 만나보세요!</p>
        <div className="flex items-center justify-between text-subtitle1 font-medium text-neutral-700 mt-6">
          <p className="flex items-center ">
            전체 게시글
            <p className="flex items-center text-subtitle1 font-bold text-neutral-800 ml-1">({archiveResult.count})</p>
          </p>
          <label className="flex items-center">
            <SortDropdown sortBy={sortMethod} handleSortChange={handleSortChange} sortOptions={sortOptions} />
          </label>
        </div>
      </div>

      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col justify-start items-start relative rounded-xl w-[399px] h-[414px]"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="flex-grow-0 flex-shrink-0 relative rounded-xl mb-2">
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
                <h2 className="text-subtitle1 font-bold text-neutral-900 my-2 mx-5">{cutText(post.title, 20)}</h2>
                <p className="text-base text-body2 font-regular text-neutral-700 mb-2 mx-5">
                  {post.user.nickname
                    ? post.user.nickname.length > 20
                      ? `${post.user.nickname.slice(0, 20)}...`
                      : post.user.nickname
                    : 'unknown user'}
                </p>
              </div>
              <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 flex-wrap h-[46px] overflow-hidden mx-5 mb-2">
                {post.archive_tags.length > 0 ? (
                  post.archive_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-neutral-50 px-3 py-1 rounded text-subtitle1 font-medium text-neutral-700 my-2 mr-2"
                      style={{ maxWidth: '100%' }}
                    >
                      #{tag.tag}
                    </span>
                  ))
                ) : (
                  <span className="h-[46px]"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No posts available.</div>
      )}
      <div className="flex justify-center items-center gap-4 mt-8 mb-[76px]">
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              disabled={index === page}
              className={`w-[33px] h-[32px] flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-2 py-1 rounded-md ${
                index === page ? 'bg-main-50' : 'bg-neutral-100 border border-neutral-100'
              }`}
            >
              <p
                className={`flex-grow-0 flex-shrink-0 text-body1 font-medium text-center ${
                  index === page ? 'text-main-500' : 'text-neutral-500'
                }`}
              >
                {index + 1}
              </p>
            </button>
          ))}
      </div>
    </>
  );
};

export default ArchivePosts;
