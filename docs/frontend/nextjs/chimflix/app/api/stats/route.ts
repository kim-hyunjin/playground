import {
  createNewStats,
  getStatsData,
  updateFavWithToken,
  updateSavedWithToken,
  updateTimeAndWatchedWithToken,
} from '@/lib/stats';
import { Stats } from '@/types/hasura';
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
    const videoId = searchParams.get('videoId');
    if (!videoId) {
      console.error('bad request - not exist videoId');
      return new Response(null, { status: 400 });
    }

    const foundVideoStats = await getStatsData(token, videoId);

    if (foundVideoStats) {
      return NextResponse.json(foundVideoStats);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      console.error('not exist token in cookie');
      return new Response(null, { status: 403 });
    }
    const body = await req.json();
    const { videoId } = body;
    if (!videoId) {
      console.error('bad request - not exist videoId');
      return new Response(null, { status: 400 });
    }

    const foundVideoStats = await getStatsData(token, videoId);

    if (foundVideoStats) {
      const { playedTime, watched, favourited, saved } = body;
      const promises = [];
      if (typeof playedTime != 'undefined' && typeof watched != 'undefined') {
        promises.push(
          updateTimeAndWatchedWithToken(token, {
            videoId,
            playedTime,
            watched,
          })
        );
      }

      if (typeof favourited !== 'undefined') {
        promises.push(
          updateFavWithToken(token, {
            videoId,
            favourited,
          })
        );
      }

      if (typeof saved !== 'undefined') {
        promises.push(
          updateSavedWithToken(token, {
            videoId,
            saved,
          })
        );
      }

      await Promise.all(promises);
      return new Response(null, { status: 200 });
    } else {
      const created = await createNewStats(token, videoId);
      return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error('Error occurred /stats', error);
    return new Response(null, { status: 500 });
  }
}
