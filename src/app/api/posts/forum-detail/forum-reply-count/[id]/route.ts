import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { data: replyCount } = await supabase.from('forum_reply').select('*(count)').eq('id', params.id);

  return NextResponse.json(replyCount);
};
