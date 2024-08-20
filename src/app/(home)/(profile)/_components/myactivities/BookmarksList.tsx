import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import PostCard from './common/PostCard';
import CommentCard from './common/CommentCard';
import { CombinedItem } from '@/types/profile/profileType';
import { combineItems } from '@/utils/combineItems';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { toast } from 'react-toastify';
import Check from '@/assets/images/common/Check';
import { useBookmarksComments, useBookmarksPosts } from '@/hooks/common/useBookmarks';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import ContentFilters from '@/components/categoryfilter/ContentFilters';
import Reset from '@/assets/images/common/Reset';
import CommentPageButton from '@/components/common/CommentPageButton';
import ActivitiesSkeletonUi from './activitiesskeleton/ActivitiesSkeletonUi';
import { BookmarkContext } from '@/providers/BookmarkProvider';
import { BookmarkType } from '@/types/buttons/bookmark';
import { useQueryClient } from '@tanstack/react-query';

type BookmarksListProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  contentType: 'all' | 'post' | 'comment';
  onCategoryChange: Dispatch<SetStateAction<'all' | 'qna' | 'forum' | 'archive'>>;
  onForumCategoryChange: Dispatch<SetStateAction<string | null>>;
  onTypeChange: Dispatch<SetStateAction<'all' | 'post' | 'comment'>>;
};

const BookmarksList = ({
  primaryCategory,
  primaryForumCategory,
  contentType,
  onCategoryChange,
  onForumCategoryChange,
  onTypeChange
}: BookmarksListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Map<string, { category: string; type: string }>>(new Map());
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showForumMenu, setShowForumMenu] = useState(false);
  const context = useContext(BookmarkContext);
  const queryClient = useQueryClient();

  if (!context) {
    throw new Error('Error');
  }

  const { removeBookmarks } = context;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems(new Map());
  }, [primaryCategory, primaryForumCategory, contentType]);

  useEffect(() => {
    setSelectedItems(new Map());
    setSelectAll(false);
  }, [currentPage]);

  const { data: posts = { archivePosts: [], forumPosts: [], qnaPosts: [] }, isLoading: postLoading } =
    useBookmarksPosts();

  const {
    data: comments = {
      archive: { posts: [], comments: [] },
      forum: { posts: [], comments: [] },
      qna: { posts: [], comments: [] }
    },
    isLoading: commentLoading
  } = useBookmarksComments();

  useEffect(() => {
    if (!postLoading && !commentLoading && posts && comments) {
      const combined = combineItems(posts, comments);
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setCombinedItems(combined);
    }
  }, [postLoading, commentLoading, posts, comments]);

  const categoryFilteredItems =
    primaryCategory === 'all'
      ? combinedItems
      : primaryCategory === 'forum'
        ? combinedItems.filter(
            (item) =>
              item.category === 'forum' &&
              (primaryForumCategory === '전체' || !primaryForumCategory || item.forum_category === primaryForumCategory)
          )
        : combinedItems.filter((item) => item.category === primaryCategory);

  const typeFilteredItems =
    contentType === 'all' ? categoryFilteredItems : categoryFilteredItems.filter((item) => item.type === contentType);

  const itemsPerPage = 5;
  const paginatedItems = typeFilteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(e.target.checked);
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      paginatedItems.forEach((item) => {
        if (!newMap.has(item.id)) {
          newMap.set(item.id, { category: item.category, type: item.type });
        }
      });
      return newMap;
    });
  };

  const handleCheckboxChange = (id: string, category: string, type: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        newMap.set(id, { category, type });
      }
      return newMap;
    });
  };

  const handleDelete = async () => {
    try {
      const postsToDelete: { id: string; category: string }[] = [];
      const commentsToDelete: { id: string; category: string }[] = [];

      selectedItems.forEach((value, key) => {
        if (value.type === 'post') {
          postsToDelete.push({ id: key, category: value.category });
        } else if (value.type === 'comment') {
          commentsToDelete.push({ id: key, category: value.category });
        }
      });

      if (postsToDelete.length > 0) {
        const response = await fetch('/api/profile/bookmarksposts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ postsToDelete })
        });
        if (!response.ok) throw new Error('포스트 삭제 요청 실패');
      }

      postsToDelete.forEach((post) => {
        removeBookmarks(post.id, post.category as BookmarkType);
        queryClient.invalidateQueries({ queryKey: ['bookmarksPosts'] });
      });

      if (commentsToDelete.length > 0) {
        const response = await fetch('/api/profile/bookmarkscomments', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ commentsToDelete })
        });
        if (!response.ok) throw new Error('댓글 삭제 요청 실패');
      }

      commentsToDelete.forEach((comment) => {
        removeBookmarks(comment.id, comment.category as BookmarkType);
        queryClient.invalidateQueries({ queryKey: ['bookmarksComments'] });
      });

      // 업데이트된 combinedItems 생성
      const updatedCombinedItems = combinedItems.filter((item) => !selectedItems.has(item.id));

      // 상태 업데이트
      setCombinedItems(updatedCombinedItems);
      setSelectedItems(new Map());

      toast.success('삭제가 완료 되었습니다.');
    } catch (error) {
      // console.error('삭제 처리 중 오류 발생:', error);
    }
  };

  const handleResetClick = () => {
    onTypeChange('all');
    setShowMenu(false);
    onCategoryChange('all');
    onForumCategoryChange(null);
  };

  if (postLoading || commentLoading) return <ActivitiesSkeletonUi />;

  return (
    <div className="relative min-h-screen">
      <Mobile>
        <div className="p-[32px_20px]">
          <div className="mb-6">
            {contentType === 'comment' ? (
              <p>총 댓글 ({typeFilteredItems.length})</p>
            ) : contentType === 'post' ? (
              <p>총 게시글 ({typeFilteredItems.length})</p>
            ) : (
              <p>총 게시물 ({typeFilteredItems.length})</p>
            )}
          </div>

          <PrimaryCategories
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            onCategoryChange={onCategoryChange}
            onForumCategoryChange={onForumCategoryChange}
            showForumMenu={showForumMenu}
            onShowForumMenu={setShowForumMenu}
          />
        </div>
        <div className="flex items-center justify-between p-[8px_20px] text-subtitle3">
          <div className="flex">
            <label className="flex items-center">
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} hidden />
              {selectedItems.size === 0 ? (
                <span className="mr-4 flex border border-neutral-200 text-neutral-500 rounded-lg p-2 h-9">
                  <Check stroke="#757575" width={20} height={20} strokeWidth={1.4} />
                  전체선택
                </span>
              ) : (
                <span className="mr-4 flex border border-main-400 text-main-400 bg-sub-50  rounded-lg p-2 h-9">
                  <Check stroke="#423edf" width={20} height={20} strokeWidth={1.4} />
                  전체선택
                </span>
              )}
            </label>
            {selectedItems.size === 0 ? (
              <button
                onClick={() => toast.error('삭제할 게시물을 선택해주세요')}
                className="border border-neutral-200 text-neutral-500 rounded-lg p-[8px_16px] h-9"
              >
                삭제
              </button>
            ) : (
              <button
                onClick={() => setConfirmModalOpen(true)}
                className="border border-neutral-200 text-neutral-500 rounded-lg p-[8px_16px] h-9"
              >
                {selectedItems.size} 삭제
              </button>
            )}
          </div>
          <div className="flex">
            {primaryCategory === 'all' && contentType === 'all' ? (
              <div className="mx-2"></div>
            ) : (
              <div className="mx-2" onClick={handleResetClick}>
                <Reset />
              </div>
            )}
            <div className="relative">
              <ContentFilters
                contentType={contentType}
                onTypeChange={onTypeChange}
                showMenu={showMenu}
                onShowMenu={setShowMenu}
              />
            </div>
          </div>
        </div>
      </Mobile>
      <Default>
        <div className="flex mb-[40px] items-center">
          <label className="flex items-center">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} hidden />
            {selectedItems.size === 0 ? (
              <span className="mr-4 flex border border-neutral-200 text-neutral-500 rounded p-[8px_16px] h-[40px] mt-6">
                <Check stroke="#757575" />
                전체선택
              </span>
            ) : (
              <span className="mr-4 flex border border-main-400 text-main-400 bg-sub-50  rounded p-[8px_16px] h-[40px] mt-6">
                <Check stroke="#423edf" />
                전체선택
              </span>
            )}
          </label>
          {selectedItems.size === 0 ? (
            <button
              onClick={() => toast.error('삭제할 게시물을 선택해주세요')}
              className="border border-neutral-200 text-neutral-500 rounded p-[8px_16px] h-[40px] mt-6"
            >
              삭제
            </button>
          ) : (
            <button
              onClick={() => setConfirmModalOpen(true)}
              className="border border-neutral-200 text-neutral-500 rounded p-[8px_16px] h-[40px] mt-6"
            >
              {selectedItems.size} 삭제
            </button>
          )}
        </div>
      </Default>
      <div className="min-h-[600px]">
        {paginatedItems.length === 0 ? (
          <div className="p-10 text-body3 md:text-body1">북마크를 추가해보세요</div>
        ) : (
          paginatedItems.map((item) => (
            <div key={item.id} className="md:mb-6">
              {item.type === 'post' ? (
                <PostCard
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  thumbnail={item.thumbnail}
                  tags={item.tags}
                  created_at={item.created_at}
                  category={item.category}
                  likesCount={item.likesCount}
                  commentsCount={item.commentsCount}
                  forum_category={item.forum_category}
                  nickname={item.user.nickname}
                  isSelected={selectedItems.has(item.id)}
                  onCheckboxChange={(id) => handleCheckboxChange(id, item.category, 'post')}
                />
              ) : (
                <CommentCard
                  id={item.id}
                  post_id={item.post_id}
                  title={item.title}
                  comment={item.comment}
                  category={item.category}
                  nickname={item.user.nickname}
                  forum_category={item.forum_category}
                  created_at={item.created_at}
                  likesCount={item.likesCount}
                  commentsCount={item.commentsCount}
                  isSelected={selectedItems.has(item.id)}
                  onCheckboxChange={(id) => handleCheckboxChange(id, item.category, 'comment')}
                />
              )}
            </div>
          ))
        )}
      </div>
      {paginatedItems.length > 1 && (
        <div className="py-2">
          <Default>
            <CommentPageButton
              totalItems={typeFilteredItems.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Default>
          <Mobile>
            <CommentPageButton
              totalItems={typeFilteredItems.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Mobile>
        </div>
      )}

      <ConfirmModal
        message={'삭제 할까요?'}
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BookmarksList;
