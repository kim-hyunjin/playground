import { getVideoDetail } from '@/lib/videos';
import { createNewStats, getStatsData } from '@/lib/stats';
import { VideoInfo } from '@/types/youtube';
import { cookies } from 'next/headers';
import VideoDetail from './video_client';
import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/react-query';
import RQHydrate from '@/utils/rq_hydrate_client';

export const revalidate = 86400; // 1 day

async function getData(videoId: string): Promise<VideoInfo | null> {
  return getVideoDetail(videoId);
}

export default async function Page({ params }: { params: { videoId: string } }) {
  const videoId = params.videoId;
  const token = cookies().get('token')?.value;

  const queryClient = getQueryClient();
  if (token) {
    const stats = await getStatsData(token, videoId);
    if (!stats) {
      await createNewStats(token, videoId);
    }
    queryClient.prefetchQuery(['stats', token, videoId], () => stats);
  }

  const dehydratedState = dehydrate(queryClient);
  const video = await getData(videoId);

  return (
    <RQHydrate state={dehydratedState}>
      <VideoDetail video={video} />
    </RQHydrate>
  );
}
