export type Stats = {
  id: number;
  userId: string;
  videoId: string;
  favourited: number | null;
  watched: boolean;
  saved: boolean;
  playedTime: number;
};
