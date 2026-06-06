import { getSavedVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { YoutubeSnippet } from '@/types/youtube';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MyList from './mylist_client';

const getData = async (
  token: string
): Promise<{
  myListVideos: YoutubeSnippet[];
  total: number;
}> => {
  const issuer = getIssuerFromToken(token);

  const videos = await getSavedVideos(token, issuer);

  if (!videos) {
    return {
      myListVideos: [],
      total: 0,
    };
  }

  const myListVideos = videos.saved.map((saved) => ({ ...saved, title: '', description: '' }));

  return {
    myListVideos,
    total: videos?.total || 0,
  };
};

export default async function Page() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/');
  }
  const props = await getData(token);

  return <MyList {...props} />;
}
