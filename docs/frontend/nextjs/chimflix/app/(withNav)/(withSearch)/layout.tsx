'use client';

import useGlobalSearch from '@/hooks/query/useGlobalSearch';
import { globalSearchKeyword } from '@/state';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import styles from '@/styles/Home.module.css';
import NoData from '@/components/error/NoData';
import SectionCards from '@/components/card/SectionCards';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const [gsk] = useAtom(globalSearchKeyword);
  const globalSearch = useGlobalSearch();

  if (gsk === '') {
    return children;
  }

  if (globalSearch.data && globalSearch.data.length > 0) {
    return (
      <div className={styles.sectionWrapperWithoutBanner}>
        <SectionCards
          title=''
          datas={globalSearch.data}
          size='small'
          type='video'
          shouldWrap={true}
          nextDataFetchOption={{
            isFetching: globalSearch.isFetching,
            hasNext: Boolean(globalSearch.hasNextPage),
            fetchNextData: globalSearch.fetchNextPage,
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.sectionWrapper}>
      <NoData />
    </div>
  );
}
