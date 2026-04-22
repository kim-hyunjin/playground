import create from 'zustand';

import getMusicUrl from 'api/getMusicUrl';

import callApiWithLoading from 'utils/callApiWithLoading';

import { Music } from 'types/Music';

const musicUrlCache = new Map<string, string>();

export type PlayingMusicStoreType = {
  music: Music | null;
  musicUrl: string;
  isPlaying: boolean;
  initialPlay: (music: Music) => void;
  play: () => void;
  pause: () => void;
};

const usePlayingMusicStore = create<PlayingMusicStoreType>((set, get) => ({
  music: null,
  musicUrl: '',
  isPlaying: false,
  initialPlay(music) {
    const cached = musicUrlCache.get(music.id);
    if (cached) {
      set({ music, musicUrl: cached, isPlaying: true });
      return;
    }

    callApiWithLoading(getMusicUrl(music.id), ({ url }) => {
      musicUrlCache.set(music.id, url);
      set({ music, musicUrl: url, isPlaying: true });
    });
  },
  play() {
    set({ isPlaying: true });
  },
  pause() {
    set({ isPlaying: false });
  },
}));

export default usePlayingMusicStore;
