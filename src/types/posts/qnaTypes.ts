import { Database } from '../supabase';

type Tables = Database['public']['Tables'];
type QnaPost = Tables['qna_posts']['Row'];
type QnaTag = Tables['qna_tags']['Row'];
type QnaImage = Tables['qna_images']['Row'];
type User = Tables['users']['Row'];

export type Post = QnaPost & {
  qna_like: { count: number }[];
  qna_comment: { count: number }[];
  qna_tags: QnaTag[];
  qna_images: QnaImage[];
  qna_reply: { count: number }[];
  user: User;
};

export type SelectedPost = QnaPost & {
  qna_like: { count: number }[];
  qna_comment: { count: number }[];
  qna_tags: QnaTag[];
  qna_images: QnaImage[];
  qna_reply: { count: number }[];
  user: User;
  selected_comment_data?: {
    id: string;
    user: User;
    comment: string;
    post_id: string;
    user_id: string;
    qna_reply: { count: number }[];
    created_at: string;
    updated_at: string;
    qna_comment_likes: { count: number }[];
  };
};

export type FetchResult = {
  data: Post[];
  count: number;
  nextPage: number | null;
};

export type SortOption = 'latest' | 'mostComments' | 'mostLikes';
