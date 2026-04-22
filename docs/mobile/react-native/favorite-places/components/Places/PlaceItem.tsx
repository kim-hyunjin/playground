import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { Place } from '../../models/place';
import { Colors } from '../../constants/colors';

type Prop = {
  place: Place;
  onSelect: (selectedPlace: Place) => void;
};
export default function PlaceItem({ place, onSelect }: Prop) {
  const handleSelectItem = () => {
    onSelect(place);
  };

  return (
    <Pressable
      onPress={handleSelectItem}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Image source={{ uri: place.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray700,
  },
  address: {
    fontSize: 18,
    color: Colors.gray700,
  },
});
