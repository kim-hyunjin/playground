import { NextApiRequest, NextApiResponse } from 'next';

import {
  findCoffeeStoresById,
  getMinifiedRecords,
  table,
} from '@/lib/airtable';

import { httpErrorHandler } from '@/utils/httpErrorHandler';

import { BadRequestError } from '@/types/errors';

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new BadRequestError('wrong api call');
    }

    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    if (!id) {
      throw new BadRequestError('ID is missing');
    }

    // find a record
    const coffeeStores = await findCoffeeStoresById(id);
    console.log('find a coffeeStore before create', coffeeStores);
    if (coffeeStores.length !== 0) {
      res.json(coffeeStores);
      return;
    }

    //create a record
    if (!name) {
      throw new BadRequestError('name is missing');
    }

    const createRecords = await table.create([
      {
        fields: {
          id,
          name,
          address,
          neighbourhood,
          voting,
          imgUrl,
        },
      },
    ]);
    const records = getMinifiedRecords(createRecords);
    res.json(records);
  } catch (err) {
    httpErrorHandler(err, res);
  }
};

export default createCoffeeStore;
