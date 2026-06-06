import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/color';

const Card = ({ children }: { children: ReactNode }) => {
  return <View style={styles.card}>{children}</View>;
};
export default Card;

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
    marginHorizontal: 24,
    borderRadius: 8,
    elevation: 4, // shadow for android
    // below, shadow for ios
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    backgroundColor: Colors.primary500,
  },
});
