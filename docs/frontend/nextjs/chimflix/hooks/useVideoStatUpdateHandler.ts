import { LIKE } from '@/types/youtube';
import useStatsMutator from './mutate/useStatsMutator';
import useFetchStats from './query/useFetchStats';

const useVideoStatUpdateHandler = (videoId: string) => {
  const { data: stats } = useFetchStats(videoId);

  const mutate = useStatsMutator();

  if (!stats) {
    return null;
  }

  const handleToggleDislike = async () => {
    const newFav = stats.favourited === LIKE.DISLIKE ? null : LIKE.DISLIKE;
    mutate({
      videoId,
      favourited: newFav,
    });
  };

  const handleToggleLike = async () => {
    const newFav = stats.favourited === LIKE.LIKE ? null : LIKE.LIKE;
    mutate({
      videoId,
      favourited: newFav,
    });
  };

  const handleToggleSave = async () => {
    const newVal = !stats.saved;
    mutate({
      videoId,
      saved: newVal,
    });
  };

  const updatePlayedTimeAndWatched = async (time: number, watched: boolean) => {
    const intTime = Math.floor(time);
    mutate({
      videoId,
      playedTime: intTime,
      watched,
    });
  };

  return {
    handleToggleLike,
    handleToggleDislike,
    handleToggleSave,
    updatePlayedTimeAndWatched,
  };
};

export default useVideoStatUpdateHandler;
