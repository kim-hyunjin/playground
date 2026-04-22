import { useEffect, useRef, useState } from 'react';

const useDebounceValue = (value: any, delay: number = 200) => {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebounced(value);
      timerRef.current = undefined;
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debounced;
};

export default useDebounceValue;
