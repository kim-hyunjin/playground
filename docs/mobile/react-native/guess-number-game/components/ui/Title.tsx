import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

const Title = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.title}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 24,
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    borderWidth: 2,
    borderColor: 'white',
    padding: 12,
  },
});
