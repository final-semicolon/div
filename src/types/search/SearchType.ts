import exp from 'constants';
import { Tables } from '../supabase';

type User = Tables<'users'>;

export type SearchPost = {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  created_at: string;
  category: 'archive' | 'forum' | 'qna';
  forum_category?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: { user_id: string }[];
  user: User;
  tag?: { tag: string }[];
};

export type SearchData = {
  archive: SearchPost[];
  forum: SearchPost[];
  qna: SearchPost[];
};
