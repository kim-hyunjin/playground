import axios from 'axios';

import { Music } from 'types/Music';

export type GetMusicsResultType = {
  total: number;
  items: Music[];
};

export default async function getMusics() {
  const { data } = await axios.get<GetMusicsResultType>('https://localhost:8000/musics');
  const { total, items } = data;

  return {
    total,
    items: items.map((item) => ({ ...item, public_date: new Date(item.public_date) })),
  };
}
