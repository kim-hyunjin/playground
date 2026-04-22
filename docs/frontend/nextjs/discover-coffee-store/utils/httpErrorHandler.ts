import { NextApiResponse } from 'next';

import { BadRequestError } from '@/types/errors';

export function httpErrorHandler(error: Error, res: NextApiResponse) {
  if (error instanceof BadRequestError) {
    res.status(error.status);
    res.json({ message: error.message });
  }

  res.status(500);
  res.json({ message: 'Something is went wrong...', error });
}
