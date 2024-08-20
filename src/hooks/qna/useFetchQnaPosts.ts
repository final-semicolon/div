'use client';

import { FetchResult } from '@/types/posts/qnaTypes';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

const fetchQnaPosts = async (page: number, status: string, limit: number): Promise<FetchResult> => {
  const response = await fetch(`/api/posts/qna/${status}?page=${page - 1}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Network response is not ok');
  }
  const data = await response.json();
  return { data: data.data, count: data.count, nextPage: data.data.length === limit ? page + 1 : null };
};

const useFetchQnaPosts = (status: string, pageSize: number) => {
  const [page, setPage] = useState(1);

  const { data, error, isPending, isError } = useQuery<FetchResult, Error>({
    queryKey: ['qnaPosts', page, status],
    queryFn: () => fetchQnaPosts(page, status, pageSize),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  });

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  return {
    data: data?.data,
    error,
    isPending,
    isError,
    page,
    totalPages,
    goToPage
  };
};

export default useFetchQnaPosts;
