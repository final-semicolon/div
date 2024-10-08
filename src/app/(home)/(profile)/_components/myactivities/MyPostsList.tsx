import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MyCombinedItem } from '@/types/profile/profileType';
import { myCombineItems } from '@/utils/combineItems';
import PostCard from './common/PostCard';
import CommentCard from './common/CommentCard';
import { useMyComments, useMyPosts } from '@/hooks/myactivities/useMyPosts';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Check from '@/assets/images/common/Check';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import ContentFilters from '@/components/categoryfilter/ContentFilters';
import Reset from '@/assets/images/common/Reset';
import CommentPageButton from '@/components/common/CommentPageButton';
import ActivitiesSkeletonUi from './activitiesskeleton/ActivitiesSkeletonUi';
import { useQueryClient } from '@tanstack/react-query';
import { revalidate } from '@/actions/revalidate';

type MyPostsListProps = {
  onTotalsChange?: (postCount: number, commentCount: number) => void;
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  contentType: 'all' | 'post' | 'comment';
  onCategoryChange: Dispatch<SetStateAction<'all' | 'qna' | 'forum' | 'archive'>>;
  onForumCategoryChange: Dispatch<SetStateAction<string | null>>;
  onTypeChange: Dispatch<SetStateAction<'all' | 'post' | 'comment'>>;
};

const MyPostsList = ({
  onTotalsChange,
  primaryCategory,
  primaryForumCategory,
  contentType,
  onCategoryChange,
  onForumCategoryChange,
  onTypeChange
}: MyPostsListProps) => {
  const { me, userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Map<string, { category: string; type: string }>>(new Map());
  const [combinedItems, setCombinedItems] = useState<MyCombinedItem[]>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showForumMenu, setShowForumMenu] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = { archivePosts: [], forumPosts: [], qnaPosts: [] }, isLoading: postLoading } = useMyPosts();
  const {
    data: comments = {
      archive: { posts: [], comments: [] },
      forum: { posts: [], comments: [] },
      qna: { posts: [], comments: [] }
    },
    isLoading: commentLoading
  } = useMyComments();

  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems(new Map());
  }, [primaryCategory, primaryForumCategory, contentType]);

  useEffect(() => {
    setSelectedItems(new Map());
    setSelectAll(false);
  }, [currentPage]);

  useEffect(() => {
    if (me === null || !me.id) return;

    if (!postLoading && !commentLoading && posts && comments) {
      const combined = myCombineItems(posts, comments);
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setCombinedItems(combined);
    }
  }, [postLoading, commentLoading, posts, comments, me]);

  useEffect(() => {
    if (onTotalsChange) {
      const totalPosts = combinedItems.filter((item) => item.type === 'post').length;
      const totalComments = combinedItems.filter((item) => item.type === 'comment').length;
      onTotalsChange(totalPosts, totalComments);
    }
  }, [combinedItems, onTotalsChange]);

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
        const response = await fetch('/api/profile/myposts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ postsToDelete })
        });
        if (!response.ok) throw new Error('게시글 삭제 요청 실패');
      }

      if (commentsToDelete.length > 0) {
        const response = await fetch('/api/profile/mycomments', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ commentsToDelete })
        });
        if (!response.ok) throw new Error('댓글 삭제 요청 실패');
      }

      const updatedCombinedItems = combinedItems.filter((item) => !selectedItems.has(item.id));

      // 상태 업데이트
      setCombinedItems(updatedCombinedItems);
      setSelectedItems(new Map());
      setSelectAll(false);

      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
      queryClient.invalidateQueries({ queryKey: ['archivePosts'] });

      revalidate('/', 'layout');

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
    <>
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
                <span className="mr-4 flex border border-neutral-200 text-neutral-500 rounded p-[8px_16px] h-10 mt-6">
                  <Check stroke="#757575" />
                  전체선택
                </span>
              ) : (
                <span className="mr-4 flex border border-main-400 text-main-400 bg-sub-50  rounded p-[8px_16px] h-10 mt-6">
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
            <div className="p-10 text-body3 md:text-body1">내가 쓴 글을 추가해보세요</div>
          ) : (
            paginatedItems.map((item) => (
              <div key={item.id} className="md:mb-6 ">
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
                    nickname={userData?.nickname || ''}
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
                    nickname={userData?.nickname || ''}
                    forum_category={item.forum_category}
                    likesCount={item.likesCount}
                    commentsCount={item.commentsCount}
                    created_at={item.created_at}
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
    </>
  );
};

export default MyPostsList;
