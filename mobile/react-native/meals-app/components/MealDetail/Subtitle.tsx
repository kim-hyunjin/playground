import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

const Subtitle = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitle}>{children}</Text>
    </View>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.brown100,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitleContainer: {
    borderBottomColor: Colors.brown100,
    borderBottomWidth: 2,
    margin: 4,
    padding: 6,
    marginHorizontal: 12,
    marginVertical: 4,
  },
});
