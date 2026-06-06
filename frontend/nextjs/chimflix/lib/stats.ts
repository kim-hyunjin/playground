import {
  findVideoStatsByUser,
  insertStats,
  updateFavStats,
  updateSavedStats,
  updateTimeAndWatchedStats,
} from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { Stats } from '@/types/hasura';

export async function getStatsData(token: string, videoId: string) {
  const issuer = getIssuerFromToken(token);

  return await findVideoStatsByUser(token, issuer, videoId);
}

export async function createNewStats(token: string, videoId: string) {
  const issuer = getIssuerFromToken(token);

  return await insertStats(token, issuer, videoId);
}

type UpdateStatsData = Omit<Stats, 'id' | 'userId'>;

export async function updateFavWithToken(
  token: string,
  data: Pick<UpdateStatsData, 'videoId' | 'favourited'>
) {
  const issuer = getIssuerFromToken(token);

  const res = await updateFavStats(token, {
    ...data,
    userId: issuer,
  });
  return res;
}

export async function updateSavedWithToken(
  token: string,
  data: Pick<UpdateStatsData, 'videoId' | 'saved'>
) {
  const issuer = getIssuerFromToken(token);

  const res = await updateSavedStats(token, {
    ...data,
    userId: issuer,
  });
  return res;
}

export async function updateTimeAndWatchedWithToken(
  token: string,
  data: Pick<UpdateStatsData, 'videoId' | 'playedTime' | 'watched'>
) {
  const issuer = getIssuerFromToken(token);

  const res = await updateTimeAndWatchedStats(token, {
    ...data,
    userId: issuer,
  });
  return res;
}
