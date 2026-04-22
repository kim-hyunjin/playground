import { useEffect, useRef } from 'react';

const useDebounceEffect = (callback: () => void, delay: number = 200) => {
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback();
      timerRef.current = undefined;
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [callback, delay]);
};

export default useDebounceEffect;
