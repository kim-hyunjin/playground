import { createApi } from 'unsplash-js';

import { CoffeeStore } from '@/types/coffee-store';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getCoffeeStorePhotos = async () => {
  const unsplashResult = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 30,
  });

  return unsplashResult.response?.results.map((result) => result.urls['small']);
};

const getUrlForCoffeeStores = (
  query: string,
  lat: number,
  lng: number,
  limit: number,
): string => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lng}&limit=${limit}`;
};

export const fetchCoffeeStores = async (lat:number = 37.5087, lng: number = 127.0632, limit = 6): Promise<CoffeeStore[]> => {
  const photos = await getCoffeeStorePhotos();
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  const url = getUrlForCoffeeStores('커피', lat, lng, limit);

  console.log(options, url);

  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  let coffeeStores: CoffeeStore[] = [];
  if (data.results) {
    coffeeStores = data.results.map((d: any, i: number) => ({
      id: d.fsq_id,
      name: d.name,
      imgUrl:
        photos?.[i] ||
        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      websiteUrl: '',
      address: d.location.formatted_address,
      neighbourhood:
        d.location.neighborhood?.[0] ||
        d.related_places?.present?.name ||
        d.location.post_town ||
        '',
    }));
  }
  return coffeeStores;
};
