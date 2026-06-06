'use client';

import SectionCards from '@/components/card/SectionCards';

import { YoutubeSnippet } from '@/types/youtube';
import useFetchSaved from '@/hooks/query/useFetchSaved';
import styles from '@/styles/MyList.module.css';

export default function MyList({
  myListVideos,
  total,
}: {
  myListVideos: YoutubeSnippet[];
  total: number;
}) {
  const { data, isFetching, hasNextPage, fetchNextPage } = useFetchSaved({
    saved: myListVideos,
    total,
  });

  return (
    <main className={styles.main}>
      <div className={styles.sectionWrapper}>
        <SectionCards
          title='내가 찜한 컨텐츠'
          datas={data}
          size='small'
          type='video'
          shouldWrap={true}
          nextDataFetchOption={{
            isFetching,
            hasNext: Boolean(hasNextPage),
            fetchNextData: fetchNextPage,
          }}
        />
      </div>
    </main>
  );
}
