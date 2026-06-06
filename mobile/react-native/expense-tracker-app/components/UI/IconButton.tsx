import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomPressable from './CustomPressable';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  onPress: () => void;
};
export default function IconButton({ icon, color, size, onPress }: Props) {
  return (
    <CustomPressable pressableProps={{ onPress }}>
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} color={color} size={size} />
      </View>
    </CustomPressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
});
