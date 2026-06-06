import {
  getPlaylistDetail,
  getPlaylistItems,
  getPlaylists,
  YoutubeSnippetsWithPage,
} from '@/lib/videos';
import { PlaylistInfo } from '@/types/youtube';
import { notFound, redirect } from 'next/navigation';
import PlaylistDetail from './playlist_client';

// export const dynamicParams = true; // default
export const revalidate = 86400; // one day

export async function generateStaticParams() {
  const listOfPlaylists = await getPlaylists();

  return listOfPlaylists.datas.map((p) => ({ playlistId: p.id }));
}

async function getData(playlistId: string) {
  const videos: YoutubeSnippetsWithPage = await getPlaylistItems(playlistId);
  const playlistInfo: PlaylistInfo | null = await getPlaylistDetail(playlistId);

  if (!playlistInfo) {
    notFound();
  }

  return {
    playlistId,
    videos,
    playlistInfo,
  };
}

export default async function Page({ params }: { params: { playlistId?: string } }) {
  if (!params.playlistId || params.playlistId.trim().length == 0) {
    redirect('/');
  }
  const props = await getData(params.playlistId);

  return <PlaylistDetail {...props} />;
}
