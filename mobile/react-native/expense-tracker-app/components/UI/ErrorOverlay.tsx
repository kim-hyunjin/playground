import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { GlobalStyles } from '../../constants/styles';

export default function ErrorOverlay({
  message,
  onConfirm,
}: {
  message: string;
  onConfirm: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred!</Text>
      <Text style={styles.text}>{message}</Text>
      <CustomButton onPress={onConfirm}>OK</CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
