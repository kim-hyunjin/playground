import cookie from 'cookie';

export const removeTokenCookie = () => {
  const val = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });
  if (document) {
    document.cookie = val;
  }
};

export const checkTokenExist = () => {
  if (typeof document === 'undefined') return false;

  const token = cookie.parse(document.cookie).token;

  return !!token;
};

export const getTokenFromCookie = () => {
  if (typeof document === 'undefined') return undefined;

  const token = cookie.parse(document.cookie).token;

  return token;
};
