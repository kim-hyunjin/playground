import { ReactNode } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import CustomPressable from './CustomPressable';

type Props = {
  children: ReactNode;
  onPress: () => void;
  mode?: 'flat';
  style?: StyleProp<ViewStyle>;
};
export default function CustomButton({ children, onPress, mode, style }: Props) {
  return (
    <View style={style}>
      <CustomPressable pressableProps={{ onPress }} pressedStyle={styles.pressed}>
        <View style={[styles.button, mode && styles[mode]]}>
          <Text style={[styles.buttonText, mode && styles[`${mode}Text`]]}>{children}</Text>
        </View>
      </CustomPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary500,
  },
  flat: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  flatText: {
    color: GlobalStyles.colors.primary200,
  },
  pressed: {
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 4,
  },
});
