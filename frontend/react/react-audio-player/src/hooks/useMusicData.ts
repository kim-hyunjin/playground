import { useEffect } from 'react';
import { useQuery } from 'react-query';

import useErrorStore from 'store/errorStore';
import useGlobalLoadingStore from 'store/globalLoadingStore';

import getMusics, { GetMusicsResultType } from 'api/getMusics';

const GET_MUSICS = 'getMusics';

const musicDataQueryConfig = {
  staleTime: 1000 * 60,
  retry: 3,
  retryDelay: 1000,
};

export const useMusicData = () => {
  const { data, isLoading, isError } = useQuery<GetMusicsResultType, any>(
    GET_MUSICS,
    () => getMusics(),
    musicDataQueryConfig,
  );

  useEffect(() => {
    useGlobalLoadingStore.setState({ isLoading: !data || isLoading });
  }, [data, isLoading]);

  if (isError) {
    useErrorStore.setState({ isError });
  }

  return data;
};
