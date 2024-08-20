import { POSTING_ERROR_MASSAGE, POSTING_SUCCESS_MASSAGE } from '@/constants/upsert.api';
import { createClient } from '@/supabase/server';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const jsonData = await request.json();

  if (jsonData.category === 'forum') {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([
        {
          user_id: jsonData.user_id as string,
          title: jsonData.title as string,
          content: jsonData.content as string,
          forum_category: jsonData.forum_category as string,
          thumbnail: jsonData.thumbnailUrl as string | null
        }
      ])
      .select();

    return error ? Response.json(POSTING_ERROR_MASSAGE) : Response.json({ data, ...POSTING_SUCCESS_MASSAGE });
  } else if (jsonData.category === 'qna') {
    const { data, error } = await supabase
      .from('qna_posts')
      .insert([
        {
          user_id: jsonData.user_id as string,
          title: jsonData.title as string,
          content: jsonData.content as string,
          thumbnail: jsonData.thumbnailUrl as string | null
        }
      ])
      .select();

    return error ? Response.json(POSTING_ERROR_MASSAGE) : Response.json({ data, ...POSTING_SUCCESS_MASSAGE });
  } else if (jsonData.category === 'archive') {
    const { data, error } = await supabase
      .from('archive_posts')
      .insert([
        {
          user_id: jsonData.user_id as string,
          title: jsonData.title as string,
          content: jsonData.content as string,
          thumbnail: jsonData.thumbnailUrl as string | null
        }
      ])
      .select();
    return error ? Response.json(POSTING_ERROR_MASSAGE) : Response.json({ data, ...POSTING_SUCCESS_MASSAGE });
  }

  return Response.json({ jsonData });
};
