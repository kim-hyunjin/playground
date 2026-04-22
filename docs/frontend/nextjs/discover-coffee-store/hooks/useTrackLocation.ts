import { useCallback, useContext, useState } from 'react';

import { ACTION_TYPES, StoreContext } from '@/context';

export const useTrackLocation = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  const handleSuccess: PositionCallback = useCallback(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      dispatch({
        type: ACTION_TYPES.SET_LOCATION,
        payload: { lat: latitude, lng: longitude },
      });
      setIsLoading(false);
      setLocationErrorMsg('');
    },
    [dispatch],
  );

  const handleError: PositionErrorCallback = useCallback(() => {
    setIsLoading(false);
    setLocationErrorMsg('Unable to retrieve your location');
  }, []);

  const handleTrackLocation = useCallback(() => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      setIsLoading(false);
      setLocationErrorMsg('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  }, [handleSuccess, handleError]);

  return {
    isLoading,
    location: state.location,
    locationErrorMsg,
    handleTrackLocation,
  };
};
