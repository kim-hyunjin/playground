import { getPlaylistItems } from '@/lib/videos';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get('pageToken') ?? undefined;
    const playlistId = searchParams.get('id');

    if (!playlistId) {
      console.error('Error occurred in /api/playlistitems - playlist id not exist');
      return new Response(null, { status: 400 });
    }

    const result = await getPlaylistItems(playlistId, pageToken);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error occurred in /api/playlistitems', error);
    return new Response(null, { status: 500 });
  }
}
