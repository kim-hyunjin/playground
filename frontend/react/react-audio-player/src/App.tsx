import { QueryClient, QueryClientProvider } from 'react-query';

import useErrorStore from 'store/errorStore';
import useGlobalLoadingStore from 'store/globalLoadingStore';

import PlayList from 'components/PlayList/PlayList';
import Player from 'components/Player/Player';
import ErrorPage from 'components/UI/ErrorPage';
import GlobalLoading from 'components/UI/GlobalLoading';

const queryClient = new QueryClient();

function App() {
  const isGlobalLoading = useGlobalLoadingStore((state) => state.isLoading);
  const isError = useErrorStore((state) => state.isError);
  return (
    <QueryClientProvider client={queryClient}>
      <PlayList />
      <Player />
      {isGlobalLoading && <GlobalLoading />}
      {isError && <ErrorPage />}
    </QueryClientProvider>
  );
}

export default App;
