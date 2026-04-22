import React from 'react';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { StoreProvider } from '@/context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
      {/* <footer>
        <p>© 2022 kim-hyunjin</p>
      </footer> */}
    </StoreProvider>
  );
}

export default MyApp;
