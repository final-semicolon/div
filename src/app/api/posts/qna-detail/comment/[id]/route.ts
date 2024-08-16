import {
  DELETE_ERROR_MASSAGE,
  EDIT_ERROR_MASSAGE,
  LOAD_ERROR_MASSAGE,
  POSTING_ERROR_MASSAGE
} from '@/constants/upsert.api';
import { createClient } from '@/supabase/server';
import { TqnaCommentsWithReplyCount } from '@/types/posts/qnaDetailTypes';
import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type Tparams = { params: { id: string } };
type TanswerData = {
  user_id: string;
  comment: string;
};

export const GET = async (request: NextRequest, { params }: Tparams) => {
  const supabase = createClient();
  const post_id = params.id;
  const urlSearchParams = request.nextUrl.searchParams;
  const page = urlSearchParams.get('page') ? Number(urlSearchParams.get('page')) : 1;
  const selecte_comment_id = urlSearchParams.get('selected');
  console.log(selecte_comment_id);
  const minRange = page === 1 ? 0 : selecte_comment_id ? (page - 1) * 5 - 1 : (page - 1) * 5;
  const maxRange =
    page === 1 && selecte_comment_id ? 3 : page === 1 ? 4 : selecte_comment_id ? page * 5 - 2 : page * 5 - 1;

  if (selecte_comment_id && page === 1) {
    const { data: commentsWithUnseleted, error: loadError } = await supabase
      .from('qna_comments')
      .select(`*,users(*),qna_reply(count),qna_comment_tag(tag)`)
      .eq('post_id', post_id)
      .neq('id', selecte_comment_id)
      .order('created_at', { ascending: false })
      .range(minRange, maxRange);

    const { data: selectedComment, error: loadSelectedError } = await supabase
      .from('qna_comments')
      .select(`*,users(*),qna_reply(count),qna_comment_tag(tag)`)
      .eq('id', selecte_comment_id as string);

    const commentsWithSelected = [
      ...(selectedComment as TqnaCommentsWithReplyCount[]),
      ...(commentsWithUnseleted as TqnaCommentsWithReplyCount[])
    ];

    return loadSelectedError
      ? NextResponse.json(LOAD_ERROR_MASSAGE)
      : NextResponse.json({ data: commentsWithSelected });
  } else if (selecte_comment_id) {
    const { data: commentsWithUnseleted, error: loadError } = await supabase
      .from('qna_comments')
      .select(`*,users(*),qna_reply(count),qna_comment_tag(tag)`)
      .eq('post_id', post_id)
      .neq('id', selecte_comment_id)
      .order('created_at', { ascending: false })
      .range(minRange, maxRange);

    return loadError ? NextResponse.json(LOAD_ERROR_MASSAGE) : NextResponse.json({ data: commentsWithUnseleted });
  }
  const { data: commentsWithUnseleted, error: loadError } = await supabase
    .from('qna_comments')
    .select(`*,users(*),qna_reply(count),qna_comment_tag(tag)`)
    .eq('post_id', post_id)
    .order('created_at', { ascending: false })
    .range(minRange, maxRange);

  return loadError ? NextResponse.json(LOAD_ERROR_MASSAGE) : NextResponse.json({ data: commentsWithUnseleted });
};

export const POST = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const post_id = params.id;

  const answerData: TanswerData = await request.json();
  const { data, error: loadError } = await supabase
    .from('qna_comments')
    .insert({ ...answerData, post_id })
    .select();

  return loadError ? NextResponse.json(POSTING_ERROR_MASSAGE) : NextResponse.json({ data });
};

export const PATCH = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;

  const answerData = await request.json();

  const { data, error: loadError } = await supabase
    .from('qna_comments')
    .update({ comment: answerData.comment })
    .eq('id', comment_id);

  const { error: deleteTagError } = await supabase.from(`qna_comment_tag`).delete().eq('comment_id', comment_id);

  Promise.all(
    answerData.tags.map(async (tag: Ttag) => {
      await supabase.from(`qna_comment_tag`).insert({ comment_id, tag: tag.name, user_id: answerData.user_id });
    })
  );

  return loadError || deleteTagError ? NextResponse.json(EDIT_ERROR_MASSAGE) : NextResponse.json({ data });
};

export const DELETE = async (request: Request, { params }: Tparams) => {
  const supabase = createClient();
  const comment_id = params.id;

  const { data, error: loadError } = await supabase.from('qna_comments').delete().eq('id', comment_id);

  return loadError ? NextResponse.json(DELETE_ERROR_MASSAGE) : NextResponse.json({ data });
};
