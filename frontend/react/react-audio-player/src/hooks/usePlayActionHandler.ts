import usePlayingMusicStore from 'store/playingMusicStore';

import { Music } from 'types/Music';

export default function usePlayActionHandler() {
  const { storedMusic, initialPlay, playStoredMusic, pause } = usePlayingMusicStore((state) => ({
    storedMusic: state.music,
    initialPlay: state.initialPlay,
    playStoredMusic: state.play,
    pause: state.pause,
  }));

  const play = (music: Music) => {
    if (storedMusic?.id === music.id) {
      playStoredMusic();
      return;
    }

    initialPlay(music);
  };

  return { play, pause };
}
