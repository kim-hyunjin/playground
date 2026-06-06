import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { rootStore, WalletLibraryContext } from "../store/RootStore";

function getLibrary(provider: ExternalProvider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletLibraryContext.Provider value={rootStore}>
        <Component {...pageProps} />;
      </WalletLibraryContext.Provider>
    </Web3ReactProvider>
  );
}

export default MyApp;
