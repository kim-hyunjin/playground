import { useEffect, useState } from 'react';

import usePlayingMusicStore from 'store/playingMusicStore';

const useAudioPlayer = () => {
  const { music, musicUrl, isPlaying } = usePlayingMusicStore((state) => ({
    music: state.music,
    musicUrl: state.musicUrl,
    isPlaying: state.isPlaying,
  }));

  const [audioTag, setAudioTag] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioTag === null) return;

    const setAudioData = () => {
      setDuration(audioTag.duration);
      setCurrentTime(audioTag.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audioTag.currentTime);

    audioTag.addEventListener('loadeddata', setAudioData);
    audioTag.addEventListener('timeupdate', setAudioTime);

    isPlaying ? audioTag.play() : audioTag.pause();

    return () => {
      audioTag.removeEventListener('loadeddata', setAudioData);
      audioTag.removeEventListener('timeupdate', setAudioTime);
    };
  }, [isPlaying, audioTag, music]);

  const timeUpdateHandler = (clickedTime: number) => {
    if (audioTag && clickedTime !== currentTime) {
      audioTag.currentTime = clickedTime;
    }
  };

  return {
    music,
    musicUrl,
    currentTime,
    duration,
    setAudioTag,
    timeUpdateHandler,
  };
};

export default useAudioPlayer;
