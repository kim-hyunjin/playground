import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Catch all route has lowest priority
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: `slug` });
}
