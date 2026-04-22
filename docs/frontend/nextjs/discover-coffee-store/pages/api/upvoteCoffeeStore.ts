import { NextApiRequest, NextApiResponse } from 'next';

import {
  findCoffeeStoresById,
  getMinifiedRecords,
  table,
} from '@/lib/airtable';

import { httpErrorHandler } from '@/utils/httpErrorHandler';

import { BadRequestError } from '@/types/errors';

const upvoteCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'PUT') {
      throw new BadRequestError('Wrong http method');
    }

    const { id } = req.body;
    if (!id) {
      throw new BadRequestError('ID is missing');
    }

    const coffeeStores = await findCoffeeStoresById(id);
    console.log({ coffeeStores });

    if (coffeeStores.length !== 0) {
      const coffeeStore = coffeeStores[0];
      const calculatedVoting = Number(coffeeStore.voting) + 1;
      const updatedCoffeeStore = await table.update([
        {
          id: coffeeStore.recordId,
          fields: {
            voting: calculatedVoting,
          },
        },
      ]);

      if (updatedCoffeeStore) {
        const minified = getMinifiedRecords(updatedCoffeeStore);
        res.json(minified);
      }
    } else {
      res.json({ message: "Coffee store id doesn't exist", id });
    }
  } catch (error) {
    httpErrorHandler(error, res);
  }
};

export default upvoteCoffeeStore;
