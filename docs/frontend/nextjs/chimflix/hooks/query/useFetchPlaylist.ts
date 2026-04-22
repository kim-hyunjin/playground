import { YoutubeSnippetsWithPage } from '@/lib/videos';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchPlaylist = ({
  queryKey,
  initialData,
}: {
  queryKey: string;
  initialData?: YoutubeSnippetsWithPage;
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey],
    async ({ pageParam = null }) => {
      const res = await fetch(`/api/playlist${pageParam ? `?pageToken=${pageParam}` : ''}`, {
        method: 'GET',
      });
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
      initialData: initialData && {
        pages: [initialData],
        pageParams: [null],
      },
      refetchOnWindowFocus: false,
    }
  );

  const seenItems: Record<string, boolean> = {};
  const data =
    queryResult.data?.pages
      .flatMap((p) => (p ? p.datas : []))
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

export default useFetchPlaylist;
