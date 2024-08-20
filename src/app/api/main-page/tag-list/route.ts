import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = createClient();

  const { data: forumTag } = await supabase.from('forum_tags').select(`tag`);
  const { data: qnaTag } = await supabase.from('qna_tags').select(`tag`);
  const { data: archiveTag } = await supabase.from('archive_tags').select(`tag`);

  const tagList = [...(forumTag || []), ...(qnaTag || []), ...(archiveTag || [])];

  return NextResponse.json(tagList);
};
