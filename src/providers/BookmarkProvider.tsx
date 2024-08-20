'use client';

import { useAuth } from '@/context/auth.context';
import { BookmarkContextType, BookmarkType } from '@/types/buttons/bookmark';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const { me } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkContextType['bookmarks']>({
    forumBookmarks: [],
    forumCommentBookmarks: [],
    qnaBookmarks: [],
    qnaCommentBookmarks: [],
    archiveBookmarks: [],
    archiveCommentBookmarks: []
  });

  const removeBookmarks = (id: string, type: BookmarkType) => {
    setBookmarks((prev) => ({
      ...prev,
      [`${type}Bookmarks`]: prev[`${type}Bookmarks`].filter((bookmarkId: string) => bookmarkId !== id)
    }));
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!me) return;
      try {
        const response = await fetch(`/api/common/bookmark?user_id=${me.id}`);
        if (response.ok) {
          const result = await response.json();
          setBookmarks({
            forumBookmarks: result.forumBookmarks.map((bookmark: { post_id: string }) => bookmark.post_id),
            forumCommentBookmarks: result.forumCommentBookmarks.map(
              (bookmark: { comment_id: string }) => bookmark.comment_id
            ),
            qnaBookmarks: result.qnaBookmarks.map((bookmark: { post_id: string }) => bookmark.post_id),
            qnaCommentBookmarks: result.qnaCommentBookmarks.map(
              (bookmark: { comment_id: string }) => bookmark.comment_id
            ),
            archiveBookmarks: result.archiveBookmarks.map((bookmark: { post_id: string }) => bookmark.post_id),
            archiveCommentBookmarks: result.archiveCommentBookmarks.map(
              (bookmark: { comment_id: string }) => bookmark.comment_id
            )
          });
        } else {
          // console.error('context error');
        }
      } catch (error) {
        // console.error('context', error);
      }
    };
    fetchBookmarks();
  }, [me]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, setBookmarks, removeBookmarks }}>{children}</BookmarkContext.Provider>
  );
};
