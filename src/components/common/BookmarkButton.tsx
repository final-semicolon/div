'use client';

import FilledBookmark from '@/assets/images/bookmark/FilledBookmark';
import UnfilledBookmark from '@/assets/images/bookmark/UnfilledBookmark';
import { useAuth } from '@/context/auth.context';
import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { BookmarkButtonProps, BookmarkType } from '@/types/buttons/bookmark';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const BookmarkButton = ({ id, type }: BookmarkButtonProps) => {
  const { me } = useAuth();
  const { bookmarks, setBookmarks } = useBookmark();
  const queryClient = useQueryClient();

  const bookmarksMap: { [key in BookmarkType]: string[] } = {
    forum: bookmarks.forumBookmarks,
    forumComment: bookmarks.forumCommentBookmarks,
    qna: bookmarks.qnaBookmarks,
    qnaComment: bookmarks.qnaCommentBookmarks,
    archive: bookmarks.archiveBookmarks,
    archiveComment: bookmarks.archiveCommentBookmarks
  };
  const currentBookmarks = bookmarksMap[type] || [];
  const isBookmarked = currentBookmarks.includes(id);

  const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!me) {
      toast.error('로그인 후 북마크가 가능합니다.');
      return;
    }

    const previousBookmarks = { ...bookmarks };
    const updatedBookmarks = isBookmarked
      ? currentBookmarks.filter((bookmarkId) => bookmarkId !== id)
      : [...currentBookmarks, id];

    setBookmarks((prev) => ({
      ...prev,
      [`${type}Bookmarks`]: updatedBookmarks
    }));

    try {
      const response = await fetch('/api/common/bookmark', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: me.id,
          post_id: type.includes('Comment') ? undefined : id,
          comment_id: type.includes('Comment') ? id : undefined,
          type
        })
      });

      if (!response.ok) {
        const errorResult = await response.json();
        // console.error('Server response error:', errorResult);
        throw new Error('Failed to update bookmark');
      }
      queryClient.invalidateQueries({ queryKey: ['bookmarksComments'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarksPosts'] });
    } catch (error) {
      // console.error('bookmark 2', error);
      setBookmarks(previousBookmarks);
    }
  };
  return <button onClick={handleBookmark}>{isBookmarked ? <FilledBookmark /> : <UnfilledBookmark />}</button>;
};

export default BookmarkButton;
