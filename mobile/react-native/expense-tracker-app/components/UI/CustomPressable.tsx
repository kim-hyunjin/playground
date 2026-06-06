import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  pressableProps: PressableProps;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
};
export default function CustomPressable({ pressableProps, children, style, pressedStyle }: Props) {
  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => (pressed ? [style, styles.pressed, pressedStyle] : style)}
    >
      {children}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
