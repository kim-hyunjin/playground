import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const useIsRouting = () => {
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  const handleRouteStart = useCallback(() => {
    setIsRouting(true);
  }, []);

  const handleRouteComplete = useCallback(() => {
    setIsRouting(false);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteComplete);
    };
  }, [router, handleRouteStart, handleRouteComplete]);

  return isRouting;
};

export default useIsRouting;
