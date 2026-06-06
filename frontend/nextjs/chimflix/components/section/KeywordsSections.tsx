import { keywords } from '@/app/(withNav)/(withSearch)/constant';
import shuffle from '@/utils/shuffle';
import { useEffect, useState } from 'react';
import SectionCardsWithKeyword from '../card/SectionCardsWithKeyword';

export default function KeywordsSections() {
  const [suffledKeywords, setSuffledKeywords] = useState<{ title: string; keyword: string }[]>([]);

  useEffect(() => {
    setSuffledKeywords(shuffle(keywords) as { title: string; keyword: string }[]);
  }, []);

  return (
    <>
      {suffledKeywords.map((c) => (
        <SectionCardsWithKeyword
          key={c.title}
          title={c.title}
          keyword={c.keyword}
          size={'medium'}
        />
      ))}
    </>
  );
}
