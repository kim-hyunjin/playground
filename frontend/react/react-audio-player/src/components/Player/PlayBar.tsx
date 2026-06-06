import { useRef } from 'react';

import styles from './PlayBar.module.scss';

export default function PlayBar({
  currentTime,
  duration,
  onTimeUpdate,
}: {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
}) {
  const bar = useRef<HTMLDivElement | null>(null);
  const curPercentage = (currentTime / duration) * 100;

  function calcClickedTime(bar: HTMLElement, e: any): number {
    const clickPositionInPage = e.pageX;
    const barStart = bar.getBoundingClientRect().left + window.scrollX;

    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / bar.offsetWidth;

    return clickPositionInBar * timePerPixel;
  }

  function handleTimeDrag(e: any) {
    if (bar.current === null) return;
    onTimeUpdate(calcClickedTime(bar.current, e));

    const updateTimeOnMove = (eMove: any) => {
      if (bar.current === null) return;
      onTimeUpdate(calcClickedTime(bar.current, eMove));
    };

    document.addEventListener('mousemove', updateTimeOnMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', updateTimeOnMove);
    });
  }

  return (
    <div
      id="player__bar"
      ref={bar}
      className={styles.bar}
      style={{
        background: `linear-gradient(to right, aqua ${curPercentage}%, white 0)`,
      }}
      onMouseDown={(e) => handleTimeDrag(e)}
    ></div>
  );
}
