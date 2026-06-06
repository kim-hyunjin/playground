import Airtable, { FieldSet, Record, Records } from 'airtable';

import { CoffeeStore } from '@/types/coffee-store';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

const table = base('coffee-stores');

export interface CoffeeStoreResponse extends CoffeeStore {
  recordId: string;
}

const getMinifiedRecord = (record: Record<FieldSet>) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records: Records<FieldSet>) => {
  return records.map((record) => getMinifiedRecord(record));
};

async function findCoffeeStoresById(
  id: string,
): Promise<CoffeeStoreResponse[]> {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  const records = getMinifiedRecords(findCoffeeStoreRecords);

  return records as CoffeeStoreResponse[];
}

export { table, getMinifiedRecords, findCoffeeStoresById };
