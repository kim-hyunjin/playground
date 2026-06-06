'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Modal from 'react-modal';

import styles from '@/styles/Video.module.css';
import { YoutubeSnippetsWithPage } from '@/lib/videos';
import { PlaylistInfo } from '@/types/youtube';
import VideoList from '@/components/videos/VideoList';
import useFetchPlaylistItem from '@/hooks/query/useFetchPlaylistItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

Modal.setAppElement('#root');

export default function PlaylistDetail({
  playlistId,
  videos,
  playlistInfo,
}: {
  playlistId: string | null;
  videos: YoutubeSnippetsWithPage;
  playlistInfo: PlaylistInfo;
}) {
  const { data, isFetching, hasNextPage, fetchNextPage } = useFetchPlaylistItem({
    queryKey: 'playlistItems',
    playlistId,
    initialData: videos,
  });

  const { setTargeEl } = useInfiniteScroll(isFetching, fetchNextPage);

  const router = useRouter();

  const handleClose = useCallback(() => {
    router.push('/');
  }, [router]);

  // 빌드시 에러가 나므로 아래 코드 필요..
  if (!playlistInfo) {
    return null;
  }

  const { title, description, publishedAt } = playlistInfo;

  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel='Watch the series'
        onRequestClose={handleClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id='ytplayer'
          className={styles.videoPlayer}
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videos.datas[0]?.id}?autoplay=1`}
          frameBorder='0'
          allowFullScreen
        ></iframe>
        <div className={styles.modalBody} style={{ marginTop: '1rem' }}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishedAt}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
          <VideoList videos={data} />
          {hasNextPage && <div ref={setTargeEl}></div>}
        </div>
      </Modal>
    </div>
  );
}
