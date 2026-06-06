import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';

function WelcomeScreen() {
  const [fetchedMessage, setFetchedMessage] = useState('');
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `https://test-7f765-default-rtdb.asia-southeast1.firebasedatabase.app/message.json?auth=${authCtx.token}`
      )
      .then((res) => {
        setFetchedMessage(res.data);
      })
      .catch((e) => setFetchedMessage(''));
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
