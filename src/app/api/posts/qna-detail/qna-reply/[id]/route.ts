import {
  DELETE_ERROR_MASSAGE,
  DELETE_SUCCESS_MASSAGE,
  EDIT_ERROR_MASSAGE,
  LOAD_ERROR_MASSAGE,
  POSTING_ERROR_MASSAGE
} from '@/constants/upsert.api';
import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type Tparams = { params: { id: string } };

export const GET = async (request: NextRequest, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;
  const urlSearchParams = request.nextUrl.searchParams;
  const page = urlSearchParams.get('page') ? Number(urlSearchParams.get('page')) : 1;

  const { data, error: loadError } = await supabase
    .from('qna_reply')
    .select(`*,users(*)`)
    .eq('comment_id', comment_id)
    .order('created_at', { ascending: false })
    .range((page - 1) * 5, page * 5 - 1);
  // const [data, count] = await Promise.all([
  //   await supabase
  //     .from('qna_reply')
  //     .select(`*,users(*)`)
  //     .eq('comment_id', comment_id)
  //     .order('created_at', { ascending: false })
  //     .range((page - 1) * 5, page * 5 - 1),
  //   await supabase.from('qna_reply').select(`count`).eq('comment_id', comment_id).single()
  // ]);
  // const { data: count, error } = await supabase.from('qna_reply').select(`count`).eq('comment_id', comment_id).single();

  return loadError ? NextResponse.json(LOAD_ERROR_MASSAGE) : NextResponse.json({ data });
};

export const POST = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;

  const qnaReplyData = await request.json();

  const { data, error: postError } = await supabase
    .from('qna_reply')
    .insert({ ...qnaReplyData, comment_id })
    .select();

  const { data: count, error } = await supabase.from('qna_reply').select(`count`).eq('comment_id', comment_id).single();

  return postError
    ? NextResponse.json(POSTING_ERROR_MASSAGE)
    : NextResponse.json({ data: { ...data, count: count?.count } });
};

export const PATCH = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const reply_id = params.id;

  const answerData = await request.json();
  const { data, error: editError } = await supabase.from('qna_reply').update(answerData).eq('id', reply_id);

  return editError ? NextResponse.json(EDIT_ERROR_MASSAGE) : NextResponse.json({ data });
};

export const DELETE = async (request: NextRequest, { params }: Tparams) => {
  const supabase = createClient();
  const reply_id = params.id;
  const commentId = request.nextUrl.searchParams.get('commentId') as string;

  const { error: deleteError } = await supabase.from('qna_reply').delete().eq('id', reply_id);
  const { data: count, error } = await supabase.from('qna_reply').select(`count`).eq('comment_id', commentId).single();

  return deleteError ? NextResponse.json(DELETE_ERROR_MASSAGE) : NextResponse.json({ count: count?.count });
};
