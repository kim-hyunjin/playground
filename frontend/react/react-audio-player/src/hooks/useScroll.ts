import { useEffect } from 'react';

export const useScrollLock = () => {
  useEffect(() => {
    document.body.style.cssText = `
            overflow: hidden;
        `;

    return () => {
      document.body.style.cssText = '';
    };
  }, []);
};
