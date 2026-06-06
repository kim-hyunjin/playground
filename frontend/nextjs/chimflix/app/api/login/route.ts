import { createNewUser, isNewUser } from '@/lib/db/hasura';
import { magicAdmin } from '@/lib/magic';
import { createJwtToken } from '@/lib/token';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';

const MAX_AGE = 7 * 24 * 60 * 60;

const setTokenCookie = (token: string) => {
  cookies().set('token', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
};

export async function POST() {
  try {
    const auth = headers().get('authorization');
    const didToken = auth ? auth.substring(7) : '';
    if (didToken === '') {
      throw Error('need authorization value');
    }

    const { issuer, email } = await magicAdmin.users.getMetadataByToken(didToken);
    if (!email || !issuer) {
      throw Error('user data not found');
    }
    const token = createJwtToken(issuer);
    setTokenCookie(token);

    const newUser = await isNewUser(token, issuer);
    if (newUser) {
      await createNewUser(token, {
        email,
        issuer,
      });
    }

    return NextResponse.json({ status: 201 });
  } catch (error: any) {
    console.error('Something went wrong logging in', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
