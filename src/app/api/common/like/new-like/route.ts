import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type LikeType =
  | 'forum_likes'
  | 'forum_comment_likes'
  | 'qna_likes'
  | 'qna_comment_likes'
  | 'archive_likes'
  | 'archive_comment_likes';

const handleLike = async (req: NextRequest) => {
  const { type, postId, userId } = await req.json();
  const supabase = createClient();

  let tableName: LikeType;

  switch (type) {
    case 'forum':
      tableName = 'forum_likes';
      break;
    case 'forumComment':
      tableName = 'forum_comment_likes';
      break;
    case 'qna':
      tableName = 'qna_likes';
      break;
    case 'qnaComment':
      tableName = 'qna_comment_likes';
      break;
    case 'archive':
      tableName = 'archive_likes';
      break;
    case 'archiveComment':
      tableName = 'archive_comment_likes';
      break;
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { error } = await supabase.from(tableName).insert([{ post_id: postId, user_id: userId }]);

  if (error) {
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
};

const handleUnlike = async (req: NextRequest) => {
  const { type, postId, userId } = await req.json();
  const supabase = createClient();

  let tableName: LikeType;

  switch (type) {
    case 'forum':
      tableName = 'forum_likes';
      break;
    case 'forumComment':
      tableName = 'forum_comment_likes';
      break;
    case 'qna':
      tableName = 'qna_likes';
      break;
    case 'qnaComment':
      tableName = 'qna_comment_likes';
      break;
    case 'archive':
      tableName = 'archive_likes';
      break;
    case 'archiveComment':
      tableName = 'archive_comment_likes';
      break;
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { error } = await supabase.from(tableName).delete().eq('post_id', postId).eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
};

export async function POST(req: NextRequest) {
  return await handleLike(req);
}

export async function DELETE(req: NextRequest) {
  return await handleUnlike(req);
}
