import axios from 'axios';

export default async function getMusicUrl(musicId: string) {
  const { data } = await axios.get<{ url: string }>(`https://localhost:8000/musics/${musicId}`);
  return data;
}
