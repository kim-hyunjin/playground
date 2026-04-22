import { YoutubeSnippetsWithPage } from '@/lib/videos';
import { OrderOption } from '@/types/youtube';

import { useInfiniteQuery } from '@tanstack/react-query';

const useSearchVideo = ({
  queryKey,
  searchKeyword,
  initialData,
  order = 'relevance',
}: {
  queryKey: string;
  searchKeyword: string;
  initialData?: YoutubeSnippetsWithPage;
  order?: OrderOption;
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey, searchKeyword],
    async ({ pageParam = null }) => {
      let url = `/api/search?order=${order}&keyword=${searchKeyword}`;
      if (pageParam) {
        url += `&pageToken=${pageParam}`;
      }
      const res = await fetch(url, { method: 'GET' });
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextPageToken,
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [null],
          }
        : undefined,
      refetchOnWindowFocus: false,
      enabled: searchKeyword !== '',
    }
  );

  const seenItems: Record<string, boolean> = {};

  const data = queryResult.data?.pages
    .flatMap((p) => (p ? p.datas : []))
    .filter((el) => {
      if (!el?.id) return false;
      if (seenItems[el.id]) {
        return false;
      }
      seenItems[el.id] = true;
      return true;
    });

  return {
    ...queryResult,
    data,
  };
};

export default useSearchVideo;
