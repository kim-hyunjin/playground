import { getTokenFromCookie } from '@/lib/cookies';
import { Stats } from '@/types/hasura';
import { useQuery } from '@tanstack/react-query';

export default function useFetchStats(videoId: string) {
  const token = getTokenFromCookie();
  return useQuery<Stats | undefined | null>(
    ['stats', videoId, token],
    async () => {
      return (await fetch(`/api/stats?videoId=${videoId}`, { method: 'GET' })).json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!token,
    }
  );
}
