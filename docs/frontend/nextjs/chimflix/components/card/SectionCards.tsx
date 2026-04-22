import { YoutubeSnippet } from '../../types/youtube';

import CardList from './CardList';

interface SectionCardsProps {
  title: string;
  datas: YoutubeSnippet[];
  type: 'video' | 'playlist';
  size?: 'large' | 'medium' | 'small';
  shouldWrap?: boolean;
  nextDataFetchOption?: {
    isFetching: boolean;
    hasNext: boolean;
    fetchNextData: () => void;
  };
}
const SectionCards = (props: SectionCardsProps) => {
  const { title, datas = [], type, size = 'medium', shouldWrap, nextDataFetchOption } = props;

  if (datas.length === 0) {
    return null;
  }
  return (
    <CardList
      title={title}
      videos={datas}
      type={type}
      isFetching={nextDataFetchOption?.isFetching}
      fetchNextData={nextDataFetchOption?.fetchNextData}
      hasNext={nextDataFetchOption?.hasNext}
      size={size}
      shouldWrap={shouldWrap}
    />
  );
};

export default SectionCards;
