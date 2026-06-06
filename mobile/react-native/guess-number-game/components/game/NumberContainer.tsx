import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/color';

const NumberContainer = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.numberText}>{children}</Text>
    </View>
  );
};

export default NumberContainer;

const styles = StyleSheet.create({
  container: {
    borderWidth: 4,
    borderColor: Colors.accent500,
    padding: 24,
    margin: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: Colors.accent500,
    fontSize: 32,
    // fontWeight: 'bold',
    fontFamily: 'open-sans-bold',
  },
});
