import { getWatchItAgainVideos } from '@/lib/videos';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      console.error('not exist token in cookie');
      return new Response(null, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get('offset');
    const watched = await getWatchItAgainVideos(token, offset ? Number(offset) : undefined);
    return NextResponse.json(watched);
  } catch (error: any) {
    console.error('Error occurred /watched', error);
    return new Response(null, { status: 500 });
  }
}
