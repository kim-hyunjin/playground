import { useEffect, useState } from 'react';

export default function useCardsSlide({
  itemLength,
  cardSize,
  hasNext,
}: {
  itemLength: number;
  cardSize: number;
  hasNext: boolean;
}) {
  const [x, setX] = useState(0);
  const [rightBtnVisivility, setRightBtnVisibility] = useState(false);

  const totalSlideWidth = itemLength * cardSize;
  const maxX = typeof window !== 'undefined' ? totalSlideWidth - window.innerWidth + cardSize : 0;

  useEffect(() => {
    if (hasNext) {
      setRightBtnVisibility(true);
      return;
    }

    // hasNext: false
    if (x >= maxX) {
      setRightBtnVisibility(false);
      return;
    }

    // x < maxX
    setRightBtnVisibility(totalSlideWidth > window.innerWidth);
  }, [x, maxX, hasNext, totalSlideWidth]);

  const handleGoLeft = () => {
    setX((prev) => {
      const target = prev - window.innerWidth + cardSize;
      return target < 0 ? 0 : target;
    });
  };

  const handleGoRight = () => {
    setX((prev) => {
      const target = prev + window.innerWidth - cardSize;
      return target < maxX ? target : maxX;
    });
  };

  return {
    x,
    rightBtnVisivility,
    leftBtnVisivility: x !== 0,
    handleGoLeft,
    handleGoRight,
  };
}
