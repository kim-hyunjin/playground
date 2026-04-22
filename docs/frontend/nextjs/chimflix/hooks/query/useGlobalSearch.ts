import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';
import useSearchVideo from './useSearchVideo';

const useGlobalSearch = () => {
  const [keyword] = useAtom(globalSearchKeyword);

  return useSearchVideo({
    queryKey: 'globalSearch',
    searchKeyword: keyword,
  });
};

export default useGlobalSearch;
