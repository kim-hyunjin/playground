import { ReactNode } from 'react';
import Colors from '../../constants/color';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

const InstructionText = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) => {
  return <Text style={[styles.instructionText, style]}>{children}</Text>;
};

export default InstructionText;

const styles = StyleSheet.create({
  instructionText: {
    fontFamily: 'open-sans',
    color: Colors.accent500,
    fontSize: 24,
  },
});
