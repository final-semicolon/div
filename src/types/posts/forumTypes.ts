import { Database } from '../supabase';

type Tables = Database['public']['Tables'];
type ForumPost = Tables['forum_posts']['Row'];
type ForumTag = Tables['forum_tags']['Row'];
type ForumImage = Tables['forum_images']['Row'];
type User = Tables['users']['Row'];

export type ForumLike = {
  user_id: string;
};

export type ForumLikeCount = {
  count: number;
};

export type ForumComment = {
  count: number;
};

export type Post = ForumPost & {
  forum_like_count: ForumLikeCount[];
  forum_like: ForumLike[];
  forum_comment: ForumComment[];
  forum_tags: ForumTag[];
  forum_images: ForumImage[];
  user: User;
};

export type PostCardProps = {
  post: Post;
};

export type SortOption = 'latest' | 'mostComments' | 'mostLikes';
export type ForumCategory = '전체' | '일상' | '커리어' | '자기개발' | '토론' | '코드 리뷰';

export type FetchResult = {
  data: Post[];
  nextPage: number | null;
};

export type CategoryTabsProps = {
  categories: ForumCategory[];
  activeCategory: ForumCategory;
  handleCategoryClick: (category: ForumCategory) => void;
};
