import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PlacesList from '../components/Places/PlacesList';
import { StackParamList } from '../navigation/StackNavigation';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RouteName } from '../navigation/route-name';
import { Place } from '../models/place';
import { fetchPlaces } from '../utils/database';

type Props = NativeStackScreenProps<StackParamList, RouteName.ALL_PLACES>;
export default function AllPlaces({ route }: Props) {
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      console.log({ places });
      setLoadedPlaces(places);
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused, route]);

  return <PlacesList places={loadedPlaces} />;
}
