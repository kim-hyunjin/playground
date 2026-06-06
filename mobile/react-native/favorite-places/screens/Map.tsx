import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import { StyleSheet, Alert } from 'react-native';
import { useState, useLayoutEffect, useCallback } from 'react';
import { LatLng } from '../models/place';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../navigation/StackNavigation';
import { RouteName } from '../navigation/route-name';
import IconButton from '../components/UI/IconButton';

type Props = NativeStackScreenProps<StackParamList, RouteName.MAP>;

export default function Map({ navigation, route }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);

  const region: Region = {
    latitude: route.params?.initialLatLng?.lat ?? 37.78,
    longitude: route.params?.initialLatLng?.lng ?? -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent) {
    if (route.params?.initialLatLng) {
      return;
    }

    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat, lng });
  }

  const savePickedLocationHandler = useCallback(
    function () {
      if (!selectedLocation) {
        Alert.alert(
          'No location picked!',
          'You have to pick a location (by tapping on the map) first!'
        );
        return;
      }

      navigation.navigate(RouteName.ADD_PLACE, { pickedLatLng: selectedLocation });
    },
    [navigation, selectedLocation]
  );

  useLayoutEffect(() => {
    if (route.params?.initialLatLng) {
      setSelectedLocation(route.params.initialLatLng);
      return;
    }
    navigation.setOptions({
      headerRight({ tintColor }) {
        return (
          <IconButton
            icon='save'
            size={24}
            color={tintColor!}
            onPress={savePickedLocationHandler}
          />
        );
      },
    });
  }, [navigation, savePickedLocationHandler, route]);

  return (
    <MapView style={styles.map} initialRegion={region} onPress={selectLocationHandler}>
      {selectedLocation && (
        <Marker
          title='Picked Location'
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
