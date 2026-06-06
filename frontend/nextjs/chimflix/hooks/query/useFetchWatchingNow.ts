import { checkTokenExist } from '@/lib/cookies';
import { YoutubeSnippet } from '@/types/youtube';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchWatchingNow = (initialData?: { watching: YoutubeSnippet[]; total: number }) => {
  const isLoggedIn = checkTokenExist();
  const queryResult = useInfiniteQuery<{
    watching: YoutubeSnippet[];
    total: number;
  }>(
    ['watching'],
    async ({ pageParam = null }) => {
      const res = await fetch(`/api/watching?offset=${pageParam || 0}`, {
        method: 'GET',
      });
      return await res.json();
    },
    {
      getNextPageParam: (lastPage, allPage) => {
        const fetchedLen = allPage.flatMap((p) => p.watching).length;
        if (lastPage.total > fetchedLen) {
          return fetchedLen;
        } else {
          null;
        }
      },
      initialData: initialData ? { pages: [initialData], pageParams: [null] } : undefined,
      refetchOnWindowFocus: false,
      enabled: isLoggedIn,
    }
  );

  const seenItems: Record<string, boolean> = {};
  const data =
    queryResult.data?.pages
      .flatMap((p) => (p ? p.watching : []))
      .filter((el) => {
        if (!el?.id) return false;
        if (seenItems[el.id]) {
          return false;
        }
        seenItems[el.id] = true;
        return true;
      }) || [];

  return {
    ...queryResult,
    data,
  };
};

export default useFetchWatchingNow;
