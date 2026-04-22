import { useState, useCallback } from 'react';
import { ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';
import Button from '../UI/Button';
import { LatLng, Place } from '../../models/place';

type Props = {
  onCreatePlace: (place: Place) => void;
};
export default function PlaceForm({ onCreatePlace }: Props) {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [pickedImage, setPickedImage] = useState('');
  const [pickedLocation, setPickedLocation] = useState<LatLng | null>(null);
  const [pickedAddress, setPickedAddress] = useState('');

  const handleChangeTitle = (text: string) => {
    setEnteredTitle(text);
  };

  const takeImageHandler = useCallback((uri: string) => {
    setPickedImage(uri);
  }, []);

  const takeLocationHandler = useCallback(
    ({ location, address }: { location: LatLng; address: string }) => {
      setPickedLocation(location);
      setPickedAddress(address);
    },
    []
  );

  const savePlaceHandler = () => {
    if (!pickedLocation) return;
    const place = new Place(enteredTitle, pickedImage, pickedAddress, pickedLocation);
    onCreatePlace(place);
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={enteredTitle} onChangeText={handleChangeTitle} />
        <ImagePicker onTakeImage={takeImageHandler} />
        <LocationPicker onTakeLocation={takeLocationHandler} />
        <Button onPress={savePlaceHandler}>Add Place</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
