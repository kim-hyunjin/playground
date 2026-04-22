import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import styles from './SectionCards.module.css';
import clsx from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from './Card';
import { YoutubeSnippet } from '@/types/youtube';
import { mobileCardSize, pcCardSize } from './constant';
import useIsMobile from '@/hooks/useIsMobile';
import useCardsSlide from '@/hooks/useCardsSlide';
import useHorizontalScrolling from '@/hooks/useHorizontalScrolling';
import { useState } from 'react';

type Props = {
  title: string;
  videos: YoutubeSnippet[];
  type: 'video' | 'playlist';
  isFetching?: boolean;
  fetchNextData?: () => void;
  hasNext?: boolean;
  shouldWrap?: boolean;
  size?: 'large' | 'medium' | 'small';
};

export default function CardList({
  title,
  videos,
  type,
  isFetching,
  fetchNextData,
  hasNext,
  shouldWrap,
  size = 'medium',
}: Props) {
  const { setTargeEl } = useInfiniteScroll(isFetching, fetchNextData);
  const { isMobile } = useIsMobile();
  const [isHover, setIsHover] = useState(false);

  const cardSize = isMobile ? mobileCardSize[size].width : pcCardSize[size].width;
  const wrapperHeight = isMobile ? mobileCardSize[size].height + 30 : pcCardSize[size].height + 20;

  const { x, rightBtnVisivility, leftBtnVisivility, handleGoLeft, handleGoRight } = useCardsSlide({
    itemLength: videos.length,
    cardSize,
    hasNext: Boolean(hasNext),
  });
  const { scrollRef, onWheel, scrollStyle } = useHorizontalScrolling();

  if (isMobile) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div
          ref={scrollRef}
          className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}
          onWheel={!shouldWrap ? onWheel : undefined}
          style={!shouldWrap ? { ...scrollStyle, height: `${wrapperHeight}px` } : undefined}
        >
          {videos.map((data, i) => (
            <Link key={data.id} href={`/${type}/${data.id}`} prefetch={false}>
              <Card imgUrl={data.imgUrl} alt={data.title} size={size} elemIndex={i} />
            </Link>
          ))}
          {hasNext && <div ref={setTargeEl}></div>}
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.container}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <h2 className={styles.title}>{title}</h2>
      {!shouldWrap && isHover && (
        <>
          {leftBtnVisivility && (
            <motion.button
              className={styles.goLeftButton}
              onClick={handleGoLeft}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
              <div className={styles.leftArrow}></div>
            </motion.button>
          )}
          {rightBtnVisivility && (
            <motion.button
              className={styles.goRightButton}
              onClick={handleGoRight}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
              <div className={styles.rightArrow}></div>
            </motion.button>
          )}
        </>
      )}
      <motion.div
        className={clsx(styles.cardWrapper, shouldWrap && styles.wrap, size)}
        animate={{ x: -x }}
        transition={{ ease: 'linear' }}
        style={{ height: `${wrapperHeight}px` }}
      >
        {videos.map((data, i) => (
          <Link key={data.id} href={`/${type}/${data.id}`} prefetch={false}>
            <Card imgUrl={data.imgUrl} alt={data.title} size={size} elemIndex={i} />
          </Link>
        ))}
        {hasNext && <div ref={setTargeEl}></div>}
      </motion.div>
    </section>
  );
}
