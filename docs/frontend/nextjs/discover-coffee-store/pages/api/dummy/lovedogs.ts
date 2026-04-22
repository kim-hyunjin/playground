import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const breed = req.query.breed;
  res.status(200).json({ message: `I love ${breed}` });
}
