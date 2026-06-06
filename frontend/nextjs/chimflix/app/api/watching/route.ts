import { getWatchingNowVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
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
    const issuer = getIssuerFromToken(token);
    const watching = await getWatchingNowVideos(token, issuer, offset ? Number(offset) : undefined);
    return NextResponse.json(watching);
  } catch (error: any) {
    console.error('Error occurred /watching', error);
    return new Response(null, { status: 500 });
  }
}
