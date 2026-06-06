import useSearchVideo from '@/hooks/query/useSearchVideo';
import { YoutubeSnippetsWithPage } from '@/lib/videos';
import CardList from './CardList';

interface SectionCardsProps {
  title: string;
  keyword: string;
  initialData?: YoutubeSnippetsWithPage;
  size?: 'large' | 'medium' | 'small';
  shouldWrap?: boolean;
}
const SectionCardsWithKeyword = ({
  title,
  keyword,
  initialData,
  size,
  shouldWrap,
}: SectionCardsProps) => {
  const { data, isFetching, hasNextPage, fetchNextPage } = useSearchVideo({
    queryKey: 'searchVideo',
    searchKeyword: keyword,
    initialData,
  });

  if (!data) {
    return null;
  }

  return (
    <CardList
      title={title}
      videos={data}
      type={'video'}
      isFetching={isFetching}
      fetchNextData={fetchNextPage}
      hasNext={hasNextPage}
      size={size}
      shouldWrap={shouldWrap}
    />
  );
};

export default SectionCardsWithKeyword;
