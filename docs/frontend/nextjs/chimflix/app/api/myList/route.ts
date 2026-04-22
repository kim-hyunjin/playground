import { getSavedVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return new Response(null, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get('offset');
    const issuer = getIssuerFromToken(token);
    const saved = await getSavedVideos(token, issuer, offset ? Number(offset) : undefined);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error('Error occurred /search', error);
    return new Response(null, { status: 500 });
  }
}
