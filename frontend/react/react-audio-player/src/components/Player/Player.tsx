import PlayBar from 'components/Player/PlayBar';
import PlayButton from 'components/Player/PlayButton';

import useAudioPlayer from 'hooks/useAudioPlayer';

import { formatPlayTime } from 'utils/formatting';

import styles from './Player.module.scss';

export default function Player() {
  const { music, currentTime, duration, timeUpdateHandler, setAudioTag, musicUrl } =
    useAudioPlayer();

  if (!music) {
    return <></>;
  }

  return (
    <div className={styles.player}>
      <PlayButton music={music} btnStyle={{ width: '1.2rem' }} />
      <div className={styles.title}>{music.title}</div>
      <div>{formatPlayTime(currentTime)}</div>
      <div className={styles.bar}>
        <PlayBar
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={(time) => timeUpdateHandler(time)}
        />
      </div>
      <div>{formatPlayTime(duration)}</div>
      <audio ref={setAudioTag} src={musicUrl} loop />
    </div>
  );
}
