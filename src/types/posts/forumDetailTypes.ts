import { Tables } from '../supabase';

export type forumDetailType = Tables<'forum_posts'> & {
  user: Tables<'users'>;
  comment: { count: number }[];
  tags: { id: string; tag: string }[];
};

type comments = {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  reply: { count: number }[];
  user: {
    id: string;
    nickname: string;
    profile_image: string;
  };
};

export type forumCommentsType = {
  id: string;
  data: comments[];
  count: number;
  length: number;
};

// data: [
//   {
//     id: '094d6fac-7e1a-468e-aed9-06e8cf5546b5',
//     user_id: 'bbbd2a95-73f2-4af4-ab32-361e2128c680',
//     post_id: 'e7b7b1bb-2512-4d92-9c40-ac2fd43e965f',
//     created_at: '2024-08-15T02:20:35.390578',
//     updated_at: '2024-08-15T08:34:42.752712',
//     comment: 'ㅇㄴㅇㄴㄴㄴㄴ',
//     user: {
//       id: 'bbbd2a95-73f2-4af4-ab32-361e2128c680',
//       info: null,
//       email: 'qwas@naver.com',
//       nickname: 'qw',
//       github_url: null,
//       profile_image:

export type userComment = {
  user_id: string | undefined;
  post_id: string;
  comment: string;
};

export type commentRetouch = {
  id: string;
  user_id: string;
  mdEditorChange: string | undefined;
};

export type replyRetouch = {
  id: string;
  user_id: string;
  replyRetouch: string | undefined;
};

type reply = {
  id: string;
  reply: string;
  created_at: string;
  comment_id: string;
  updated_at: string;
  user_id: string;
  user: {
    nickname: string;
    profile_image: string;
  };
};

export type forumReplyType = {
  id: string;
  reply: reply[];
  created_at: string;
  comment_id: string;
  updated_at: string;
  count: number;
};

export type CommentReply = {
  user_id: string | undefined;
  comment_id: string;
  reply: string;
};
