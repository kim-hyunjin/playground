import { PressableProps, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

const CustomPressable = (
  props: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> }
) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [props.style, pressed ? styles.buttonPressed : null]}
      android_ripple={{ color: '#cccccc' }}
    >
      {props.children}
    </Pressable>
  );
};

export default CustomPressable;

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.5,
  },
});
