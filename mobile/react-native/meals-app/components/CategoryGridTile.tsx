import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import shadow from '../styles/shadow';
import CustomPressable from './CustomPressable';

const CategoryGridTile = ({
  title,
  color,
  onPress,
}: {
  title: string;
  color: string;
  onPress: () => void;
}) => {
  return (
    <View style={[styles.gridItem]}>
      <CustomPressable style={styles.button} onPress={onPress}>
        <View style={[styles.innerContainer, { backgroundColor: color }]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </CustomPressable>
    </View>
  );
};

export default CategoryGridTile;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 16,
    height: 150,
    borderRadius: 8,
    backgroundColor: 'white',
    ...shadow,
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
