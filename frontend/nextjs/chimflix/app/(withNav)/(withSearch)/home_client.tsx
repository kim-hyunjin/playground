'use client';

import Banner from '@/components/banner/Banner';
import SectionCards from '@/components/card/SectionCards';
import styles from '@/styles/Home.module.css';

import useFetchPlaylist from '@/hooks/query/useFetchPlaylist';
import useFetchWatched from '@/hooks/query/useFetchWatched';
import useFetchVideo from '@/hooks/query/useFetchVideo';
import useFetchSaved from '@/hooks/query/useFetchSaved';
import useFetchWatchingNow from '@/hooks/query/useFetchWatchingNow';
import KeywordsSections from '@/components/section/KeywordsSections';

export default function Home() {
  const recentVideos = useFetchVideo({
    queryKey: 'recentVideos',
    order: 'date',
  });
  const popularVideos = useFetchVideo({
    queryKey: 'popularVideos',
    order: 'viewCount',
  });
  const playlists = useFetchPlaylist({
    queryKey: 'playlists',
  });

  const watched = useFetchWatched();
  const saved = useFetchSaved();
  const watching = useFetchWatchingNow();

  const bannerVideo = recentVideos.data?.[0];
  return (
    <>
      {bannerVideo && (
        <Banner videoId={bannerVideo.id} title={bannerVideo.title} imgUrl={bannerVideo.imgUrl} />
      )}
      <div className={styles.sectionWrapper}>
        <SectionCards
          title='최신 컨텐츠'
          datas={recentVideos.data || []}
          size={'large'}
          type={'video'}
          nextDataFetchOption={{
            isFetching: recentVideos.isFetching,
            hasNext: (recentVideos.data || []).length <= 100 && Boolean(recentVideos.hasNextPage),
            fetchNextData: recentVideos.fetchNextPage,
          }}
        />
        <SectionCards
          title='인기 컨텐츠'
          datas={popularVideos.data || []}
          size={'large'}
          type={'video'}
          nextDataFetchOption={{
            isFetching: popularVideos.isFetching,
            hasNext: (popularVideos.data || []).length <= 100 && Boolean(popularVideos.hasNextPage),
            fetchNextData: popularVideos.fetchNextPage,
          }}
        />
        <SectionCards
          title='시청중인 컨텐츠'
          datas={watching.data}
          size={'large'}
          type={'video'}
          nextDataFetchOption={{
            isFetching: watching.isFetching,
            hasNext: Boolean(watching.hasNextPage),
            fetchNextData: watching.fetchNextPage,
          }}
        />
        <SectionCards
          title='내가 찜한 컨텐츠'
          datas={saved.data}
          size={'medium'}
          type={'video'}
          nextDataFetchOption={{
            isFetching: saved.isFetching,
            hasNext: Boolean(saved.hasNextPage),
            fetchNextData: saved.fetchNextPage,
          }}
        />
        <SectionCards
          title='다시보기'
          datas={watched.data}
          size={'medium'}
          type={'video'}
          nextDataFetchOption={{
            isFetching: watched.isFetching,
            hasNext: Boolean(watched.hasNextPage),
            fetchNextData: watched.fetchNextPage,
          }}
        />
        <SectionCards
          title='플레이리스트'
          datas={playlists.data}
          size={'medium'}
          type={'playlist'}
          nextDataFetchOption={{
            isFetching: playlists.isFetching,
            hasNext: Boolean(playlists.hasNextPage),
            fetchNextData: playlists.fetchNextPage,
          }}
        />
        <KeywordsSections />
      </div>
    </>
  );
}
