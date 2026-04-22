import { NextApiRequest, NextApiResponse } from 'next';

import { fetchCoffeeStores } from '@/lib/coffee-store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { lat, lng, limit } = req.query;
  try {
    const fetchedCoffeeStore = await fetchCoffeeStores(
      Number(lat) || undefined,
      Number(lng) || undefined,
      Number(limit) || undefined,
    );
    res.status(200).json(fetchedCoffeeStore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
}
