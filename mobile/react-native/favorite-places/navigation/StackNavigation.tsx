import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteName } from './route-name';
import AllPlaces from '../screens/AllPlaces';
import AddPlace from '../screens/AddPlace';
import IconButton from '../components/UI/IconButton';
import { Colors } from '../constants/colors';
import Map from '../screens/Map';
import { LatLng, Place } from '../models/place';
import PlaceDetail from '../screens/PlaceDetail';

export type StackParamList = {
  [RouteName.ALL_PLACES]: undefined;
  [RouteName.ADD_PLACE]?: {
    pickedLatLng?: LatLng;
  };
  [RouteName.MAP]?: {
    initialLatLng?: LatLng;
  };
  [RouteName.DETAIL]: {
    placeId: string;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary500,
        },
        headerTintColor: Colors.gray700,
        contentStyle: {
          backgroundColor: Colors.gray700,
        },
      }}
    >
      <Stack.Screen
        name={RouteName.ALL_PLACES}
        component={AllPlaces}
        options={({ navigation }) => ({
          title: 'Your Favorite Places',
          headerRight({ tintColor }) {
            return (
              <IconButton
                icon='add'
                size={24}
                color={tintColor!}
                onPress={() => {
                  navigation.navigate(RouteName.ADD_PLACE);
                }}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name={RouteName.ADD_PLACE}
        component={AddPlace}
        options={{
          title: 'Add a new place',
        }}
      />
      <Stack.Screen name={RouteName.MAP} component={Map} />
      <Stack.Screen
        name={RouteName.DETAIL}
        component={PlaceDetail}
        options={{
          title: 'Loading Place...',
        }}
      />
    </Stack.Navigator>
  );
}
