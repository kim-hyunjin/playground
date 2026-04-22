import { useEffect, useState } from 'react';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth <= 450;
    setIsMobile(isMobile);
  }, []);

  return { isMobile };
}
