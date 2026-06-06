import PlayItem from 'components/PlayList/PlayItem';
import Wrapper from 'components/UI/Wrapper';

import { useMusicData } from 'hooks/useMusicData';

import styles from './PlayList.module.scss';

export default function PlayList() {
  const musicData = useMusicData();

  const orderedMusic = musicData?.items.sort((a, b) => {
    return +b.public_date - +a.public_date;
  });

  return (
    <Wrapper title={'플레이리스트'}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {orderedMusic?.map((music) => (
            <PlayItem key={music.id} music={music} />
          ))}
        </ul>
      </div>
    </Wrapper>
  );
}
