import { getTokenFromCookie } from '@/lib/cookies';
import { Stats } from '@/types/hasura';
import { LIKE } from '@/types/youtube';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateStats = async (newStats: {
  videoId: string;
  favourited?: LIKE | null;
  saved?: boolean;
  playedTime?: number;
  watched?: boolean;
}): Promise<void> => {
  fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });
};

export default function useStatsMutator() {
  const queryClient = useQueryClient();
  const token = getTokenFromCookie();
  const { mutate } = useMutation({
    mutationFn: updateStats,
    async onMutate(variables) {
      await queryClient.cancelQueries(['stats', variables.videoId, token]);
      const previousStats = queryClient.getQueryData<Stats>(['stats', variables.videoId, token]);
      if (previousStats) {
        const newStat: Stats = {
          id: previousStats.id,
          userId: previousStats.userId,
          videoId: previousStats.videoId,
          favourited:
            variables.favourited !== undefined ? variables.favourited : previousStats.favourited,
          playedTime:
            variables.playedTime !== undefined ? variables.playedTime : previousStats.playedTime,
          saved: variables.saved !== undefined ? variables.saved : previousStats.saved,
          watched: variables.watched !== undefined ? variables.watched : previousStats.watched,
        };
        queryClient.setQueryData(['stats', variables.videoId, token], newStat);
      }

      return { previousStats };
    },
    onError(error, variables, context) {
      console.error(error);
      queryClient.setQueryData(['stats', variables.videoId, token], context?.previousStats);
    },
    onSettled(data, error, variables, context) {
      // 아래에서 다시 네트워크를 통해 데이터를 가져오는 경우 UI에 문제 발생 - 낙관적으로 업데이트 되었다고 가정.
      // queryClient.invalidateQueries(['stats', variables.videoId, token]);
    },
  });

  return mutate;
}
