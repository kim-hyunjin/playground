import { getPlaylistDetail, getPlaylists } from '@/lib/videos';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get('pageToken') ?? undefined;
    const playlistId = searchParams.get('id');

    if (playlistId) {
      const detail = await getPlaylistDetail(playlistId);
      return NextResponse.json(detail);
    }

    const playlists = await getPlaylists(pageToken);
    return NextResponse.json(playlists);
  } catch (error: any) {
    console.error('Error occurred in /api/playlist', error);
    return new Response(null, { status: 500 });
  }
}
