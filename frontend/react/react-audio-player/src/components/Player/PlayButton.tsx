import usePlayingMusicStore from 'store/playingMusicStore';

import usePlayActionHandler from 'hooks/usePlayActionHandler';

import { Music } from 'types/Music';

import PlayIcon from 'assets/images/ic-small-fill-play-gray.png';
import StopIcon from 'assets/images/ic-small-line-stop-gray.png';

import styles from './PlayButton.module.scss';

export default function PlayButton({
  music,
  btnStyle,
}: {
  music: Music;
  btnStyle?: React.CSSProperties;
}) {
  const { nowPlayingMusic, isPlaying } = usePlayingMusicStore((state) => ({
    nowPlayingMusic: state.music,
    isPlaying: state.isPlaying,
  }));
  const { play, pause } = usePlayActionHandler();

  const isThisMusicPlaying = isPlaying && nowPlayingMusic?.id === music.id;
  return (
    <div className={styles.btn}>
      {isThisMusicPlaying ? (
        <img style={{ ...btnStyle }} src={StopIcon} alt="stop" onClick={() => pause()} />
      ) : (
        <img style={{ ...btnStyle }} src={PlayIcon} alt="play" onClick={() => play(music)} />
      )}
    </div>
  );
}
