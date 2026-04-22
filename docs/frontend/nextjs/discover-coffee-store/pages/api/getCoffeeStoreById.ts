import { NextApiRequest, NextApiResponse } from 'next';

import { findCoffeeStoresById } from '@/lib/airtable';

import { httpErrorHandler } from '@/utils/httpErrorHandler';

import { BadRequestError } from '@/types/errors';

const getCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id } = req.query;
  try {
    if (!id) {
      throw new BadRequestError('ID is missing');
    }
    const coffeeStores = await findCoffeeStoresById(id.toString());

    if (coffeeStores.length !== 0) {
      res.json(coffeeStores);
    } else {
      res.json({ message: `Id could not be found` });
    }
  } catch (error) {
    httpErrorHandler(error, res);
  }
};

export default getCoffeeStoreById;
