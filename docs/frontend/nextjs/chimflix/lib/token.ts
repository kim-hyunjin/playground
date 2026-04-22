import jwt from 'jsonwebtoken';

// only can use server-side
export const createJwtToken = (issuer: string) => {
  const token = jwt.sign(
    {
      issuer,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'admin'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': `${issuer}`,
      },
    },
    String(process.env.JWT_SECRET)
  );

  return token;
};

// only can use server-side
export const getIssuerFromToken = (token: string): string => {
  const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
  if (typeof decoded === 'string' || !decoded.issuer) {
    throw Error('issuer value not exist in jwt');
  }
  return decoded.issuer;
};
