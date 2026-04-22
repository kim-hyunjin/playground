import { YoutubeSnippetsWithPage } from '@/lib/videos';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchPlaylistItem = ({
  queryKey,
  playlistId,
  initialData,
}: {
  queryKey: string;
  playlistId: string | null;
  initialData: YoutubeSnippetsWithPage;
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey, playlistId],
    async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/playlistItems?id=${playlistId}${pageParam ? `&pageToken=${pageParam}` : ''}`,
        {
          method: 'GET',
        }
      );
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextPageToken || null,
      initialData: {
        pages: [initialData],
        pageParams: [null],
      },
      refetchOnWindowFocus: false,
      enabled: playlistId !== null && playlistId !== undefined,
    }
  );

  // if (queryResult.isSuccess && queryResult.data?.pages) {

  // }

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

export default useFetchPlaylistItem;
