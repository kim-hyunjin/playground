import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import { useState, useEffect } from 'react';

import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import { LatLng } from '../../models/place';
import { getAddress, getMapPreview } from '../../utils/location';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigation';
import { RouteName } from '../../navigation/route-name';

type Props = {
  onTakeLocation: (props: { location: LatLng; address: string }) => void;
};
export default function LocationPicker({ onTakeLocation }: Props) {
  const [pickedLocation, setPickedLocation] = useState<LatLng | null>(null);
  const [permissionInfo, requestPermission] = useForegroundPermissions();
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, RouteName.ADD_PLACE>>();
  const mapPickedLocation = route.params?.pickedLatLng;

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
    }
  }, [mapPickedLocation]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(pickedLocation);
        onTakeLocation({ location: pickedLocation, address });
      }
    }

    handleLocation();
  }, [pickedLocation, onTakeLocation]);

  async function verifyPermissions() {
    if (permissionInfo?.status === PermissionStatus.UNDETERMINED) {
      const res = await requestPermission();

      return res.granted;
    }

    if (permissionInfo?.status === PermissionStatus.DENIED) {
      Alert.alert('Insufficient Permissions', 'Permission to access camera roll is required!');
      const res = await requestPermission();
      return res.granted;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    console.log(location);
    const latlng = { lat: location.coords.latitude, lng: location.coords.longitude };
    setPickedLocation(latlng);
  }

  function pickOnMapHandler() {
    navigation.navigate(RouteName.MAP);
  }

  let mapPreview = <Text>No location picked yet</Text>;

  if (pickedLocation) {
    mapPreview = (
      <Image source={{ uri: getMapPreview(pickedLocation) }} style={styles.mapPreviewImage} />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{mapPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon='location' onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon='map' onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mapPreviewImage: {
    width: '100%',
    height: '100%',
  },
});
