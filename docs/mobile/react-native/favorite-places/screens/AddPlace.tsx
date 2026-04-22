import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PlaceForm from '../components/Places/PlaceForm';
import { Place } from '../models/place';
import { StackParamList } from '../navigation/StackNavigation';
import { RouteName } from '../navigation/route-name';
import { insertPlace } from '../utils/database';

type Props = NativeStackScreenProps<StackParamList>;
export default function AddPlace({ navigation }: Props) {
  const createPlaceHandler = async (place: Place) => {
    await insertPlace(place);
    navigation.navigate(RouteName.ALL_PLACES);
  };

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}
