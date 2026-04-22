import useErrorStore from 'store/errorStore';
import useGlobalLoadingStore from 'store/globalLoadingStore';

export default function callApiWithLoading<T>(
  fetcher: Promise<T>,
  onSuccess: (result: T) => void,
  onError?: (err: Error) => void,
) {
  useGlobalLoadingStore.setState({ isLoading: true });
  fetcher
    .then(onSuccess)
    .catch((e) => {
      if (onError) {
        onError(e);
      } else {
        useErrorStore.setState({ isError: true });
      }
    })
    .finally(() => {
      useGlobalLoadingStore.setState({ isLoading: false });
    });
}
