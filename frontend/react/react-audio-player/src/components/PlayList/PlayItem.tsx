import MoodTags from 'components/PlayList/MoodTags';
import PlayButton from 'components/Player/PlayButton';
import Tag from 'components/UI/Tag';

import { formatDate } from 'utils/formatting';

import { Music } from 'types/Music';

import styles from './PlayItem.module.scss';

export default function PlayItem({ music }: { music: Music }) {
  return (
    <li className={styles.card}>
      <div className={styles.left}>
        <PlayButton music={music} />
        <div className={styles.name}>{music.title}</div>
      </div>
      <div className={styles.right}>
        <MoodTags moods={music.moods} />
        <Tag name={music.genre} />
        <div>{formatDate(music.public_date)}</div>
      </div>
    </li>
  );
}
