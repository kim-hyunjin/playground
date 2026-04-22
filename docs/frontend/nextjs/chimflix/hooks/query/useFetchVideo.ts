import { YoutubeSnippetsWithPage } from '@/lib/videos';
import { OrderOption } from '@/types/youtube';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchVideo = ({
  queryKey,
  initialData,
  order = 'relevance',
}: {
  queryKey: string;
  initialData?: YoutubeSnippetsWithPage;
  order?: OrderOption;
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey],
    async ({ pageParam = null }) => {
      let url = `/api/search?order=${order}`;
      if (pageParam) {
        url += `&pageToken=${pageParam}`;
      }
      const res = await fetch(url, { method: 'GET' });
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [null],
          }
        : undefined,
      refetchOnWindowFocus: false,
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

export default useFetchVideo;
