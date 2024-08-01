import { POSTING_ERROR_MASSAGE } from '@/constants/upsert.api';
import { createClient } from '@/supabase/server';
import { NextRequest } from 'next/server';

type Tparams = { params: { id: string } };

export const GET = async (request: NextRequest, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;
  const urlSearchParams = request.nextUrl.searchParams;
  const page = urlSearchParams.get('page') ? Number(urlSearchParams.get('page')) : 0;

  const { data, error: loadError } = await supabase
    .from('qna_reply')
    .select(`*,users(*)`)
    .eq('comment_id', comment_id)
    .order('created_at', { ascending: false })
    .range(page * 5, (page + 1) * 5 - 1);

  return loadError ? Response.json(POSTING_ERROR_MASSAGE) : Response.json({ data });
};

export const POST = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;

  const qnaReplyData = await request.json();

  const { data, error: postError } = await supabase
    .from('qna_reply')
    .insert({ ...qnaReplyData, comment_id })
    .select();

  return postError ? Response.json(POSTING_ERROR_MASSAGE) : Response.json({ data });
};
