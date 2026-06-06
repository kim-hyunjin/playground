import { YoutubeSnippet } from '@/types/youtube';
import Link from 'next/link';
import Card from '../card/Card';

import styles from './VideoList.module.css';

const VideoList = ({ videos }: { videos: YoutubeSnippet[] }) => {
  return (
    <ul className={styles.listWrapper}>
      {videos.map((v, i) => (
        <li key={v.id} className={styles.listItem}>
          <div className={styles.listItemLeft}>
            <div className={styles.listItemNumber}>{i + 1}</div>
            <Link href={`/video/${v.id}`} prefetch={false}>
              {/* <iframe
          id='ytplayer'
          width='200'
          height='100'
          src={`https://www.youtube.com/embed/${v.id}`}
          frameBorder='0'
          allowFullScreen
        ></iframe> */}
              <Card imgUrl={v.imgUrl} size='small' elemIndex={i} />
            </Link>
          </div>

          <div className={styles.listItemTitle}>
            <p>{v.title}</p>
            <p className={styles.description}>{v.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default VideoList;
