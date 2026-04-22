import { getVideos, getVideosWithKeyword } from '@/lib/videos';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    const order = searchParams.get('order');
    const pageToken = searchParams.get('pageToken') ?? undefined;

    if (!(order == 'date' || order == 'viewCount' || order == 'relevance')) {
      return new Response(null, { status: 400 });
    }

    if (keyword) {
      const result = await getVideosWithKeyword({
        keyword,
        order,
        pageToken,
      });
      return NextResponse.json(result);
    } else {
      const result = await getVideos({ order, pageToken });
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error('Error occurred in /api/search', error);
    return new Response(null, { status: 500 });
  }
}
