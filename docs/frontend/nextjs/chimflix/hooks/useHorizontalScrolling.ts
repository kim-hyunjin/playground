import { CSSProperties, useCallback, useRef, WheelEventHandler } from 'react';

const useHorizontalScrolling = <T extends HTMLElement = HTMLDivElement>() => {
  const scrollRef = useRef<T | null>(null);

  const onWheel: WheelEventHandler<HTMLElement> = useCallback((e) => {
    if (!scrollRef.current) return;
    if (e.deltaY == 0) return;

    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + e.deltaY * 10,
      behavior: 'smooth',
    });
  }, []);

  const scrollStyle: CSSProperties = {
    overflow: 'scroll',
    overflowY: 'hidden',
    overscrollBehavior: 'contain',
  };

  return { scrollRef, onWheel, scrollStyle };
};

export default useHorizontalScrolling;
